#!/usr/bin/env node

import * as fs from "fs";
import * as path from "path";
import * as readline from "readline";

// Determine the correct base path - if we're running from dist, go up to the root
const currentDir = __dirname; // This is where the compiled JS is
let packageRoot: string;

// If we're in dist/cli, we need to go up 2 levels to reach the root
if (currentDir.endsWith(path.join("dist", "cli"))) {
  packageRoot = path.join(currentDir, "..", ".."); // Go up 2 levels to root
} else {
  // If we're running from the source location, go up 3 levels to reach appium-cucumber-steps
  packageRoot = path.join(currentDir, "..", "..", "..");
}

const apkSource = path.join(packageRoot, "apps", "ApiDemos-debug.apk");
const scenariosSource = path.join(packageRoot, "test-scenarios");

// Check if --typescript or --javascript flag is provided
const args = process.argv.slice(2);
let useTypeScript: boolean | null = null;

if (args.includes("--typescript") || args.includes("--ts")) {
  useTypeScript = true;
} else if (args.includes("--javascript") || args.includes("--js")) {
  useTypeScript = false;
}

const templates = {
  // TypeScript versions - Fixed to properly handle types
  wdioConfigTS: `import type { Options } from '@wdio/types';
import * as path from 'path';

export const config: Options.Testrunner = {
  runner: 'local',
  specs: ['./features/**/*.feature'],
  exclude: [],
  maxInstances: 1,
  capabilities: [{
    platformName: 'Android',
    'appium:deviceName': 'emulator-5554',
    'appium:platformVersion': '13.0',
    'appium:app': path.join(__dirname, 'apps', 'ApiDemos-debug.apk'),
    'appium:automationName': 'UiAutomator2',
    'appium:newCommandTimeout': 240,
    'appium:autoGrantPermissions': true
  }] as WebdriverIO.Capabilities[],
  logLevel: 'info',
  bail: 0,
  waitforTimeout: 10000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,
  services: [
    ['appium', {
      args: {
        address: 'localhost',
        port: 4723
      },
      logPath: './'
    }]
  ],
  framework: 'cucumber',
  reporters: ['spec'],
  cucumberOpts: {
    require: ['./features/step_definitions/**/*.ts'],
    backtrace: false,
    requireModule: [],
    dryRun: false,
    failFast: false,
    snippets: true,
    source: true,
    strict: false,
    tags: '', // Updated from deprecated tagExpression
    timeout: 60000,
    ignoreUndefinedDefinitions: false
  },
  autoCompileOpts: {
    autoCompile: true,
    tsNodeOpts: {
      transpileOnly: true,
      project: './tsconfig.json'
    }
  }
};
`,

  hooksTS: `import { Before, After, Status, setDefaultTimeout } from '@cucumber/cucumber';
import { AppiumWorld } from 'appium-cucumber-steps';

setDefaultTimeout(60000);

Before(async function (this: AppiumWorld) {
  await this.setDriver(browser as any, 'android');
});

After(async function (this: AppiumWorld, scenario) {
  if (scenario.result?.status === Status.FAILED) {
    try {
      const screenshot = await this.driver.takeScreenshot();
      this.attach(screenshot, 'image/png');
    } catch (error) {
      console.error('Failed to take screenshot:', error);
    }
  }
});
`,

  stepsTS: `// Import all pre-built Cucumber steps from the package
import 'appium-cucumber-steps/steps/index';
`,

  worldTS: `import { setWorldConstructor } from '@cucumber/cucumber';
import { AppiumWorld } from 'appium-cucumber-steps';

setWorldConstructor(AppiumWorld);
`,

  tsconfig: `{
  "compilerOptions": {
    "target": "ES2020",
    "module": "Node16",
    "moduleResolution": "Node16",
    "lib": ["ES2020"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "types": ["node", "@wdio/globals/types"]
  },
  "include": ["features/**/*", "wdio.conf.ts"],
  "exclude": ["node_modules"]
}
`,

  // JavaScript versions (updated to use CommonJS module.exports syntax)
  wdioConfig: `const path = require('path');

exports.config = {
  runner: 'local',
  specs: ['./features/**/*.feature'],
  exclude: [],
  maxInstances: 1,
  capabilities: [{
    platformName: 'Android',
    'appium:deviceName': 'emulator-5554',
    'appium:platformVersion': '12.0',
    'appium:app': path.join(__dirname, 'apps', 'ApiDemos-debug.apk'),
    'appium:automationName': 'UiAutomator2',
    'appium:newCommandTimeout': 240,
    'appium:autoGrantPermissions': true
  }],
  logLevel: 'info',
  bail: 0,
  waitforTimeout: 10000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,
  services: [
    ['appium', {
      args: {
        address: 'localhost',
        port: 4723
      },
      logPath: './'
    }]
  ],
  framework: 'cucumber',
  reporters: ['spec'],
  cucumberOpts: {
    require: ['./features/step_definitions/**/*.js'],
    backtrace: false,
    requireModule: [],
    dryRun: false,
    failFast: false,
    snippets: true,
    source: true,
    strict: false,
    tags: '', // Updated from deprecated tagExpression
    timeout: 60000,
    ignoreUndefinedDefinitions: false
  }
};
`,

  hooks: `const { Before, After, Status, setDefaultTimeout } = require('@cucumber/cucumber');
const { AppiumWorld } = require('appium-cucumber-steps');

setDefaultTimeout(60000);

Before(async function () {
  await this.setDriver(browser, 'android');
});

After(async function (scenario) {
  if (scenario.result?.status === Status.FAILED) {
    try {
      const screenshot = await this.driver.takeScreenshot();
      this.attach(screenshot, 'image/png');
    } catch (error) {
      console.error('Failed to take screenshot:', error);
    }
  }
});
`,

  steps: `// Import all pre-built Cucumber steps from the package
require('appium-cucumber-steps/steps/index');
`,

  world: `const { setWorldConstructor } = require('@cucumber/cucumber');
const { AppiumWorld } = require('appium-cucumber-steps');

setWorldConstructor(AppiumWorld);
`,

  packageJson: `{
  "name": "my-appium-tests",
  "version": "1.0.0",
  "type": "commonjs",
  "dependencies": {
    "appium-cucumber-steps": "file:../../../appium-cucumber-steps-1.0.0.tgz"
  },
  "devDependencies": {
    "appium": "^3.1.2"
  },
  "scripts": {
    "test": "npx wdio run wdio.conf.js",
    "test:smoke": "npx wdio run wdio.conf.js --cucumberOpts.tags='@smoke'",
    "test:navigation": "npx wdio run wdio.conf.js --cucumberOpts.tags='@navigation'",
    "test:interaction": "npx wdio run wdio.conf.js --cucumberOpts.tags='@interaction'",
    "test:assertions": "npx wdio run wdio.conf.js --cucumberOpts.tags='@assertions'",
    "appium": "npx appium"
  }
}
`,

  readme: `# Appium Cucumber Tests

## Setup

This project is pre-configured with:
- ✅ ApiDemos test app (bundled)
- ✅ Comprehensive test scenarios
- ✅ All step definitions ready to use

### 1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

### 2. Install Appium driver:
\`\`\`bash
npx appium driver install uiautomator2
\`\`\`

### 3. Start Android emulator or connect device

### 4. Start Appium server:
\`\`\`bash
npm run appium
\`\`\`

### 5. Run tests:
\`\`\`bash
npm run test                    # Run all tests
npm run test:smoke          # Run smoke tests only
npm run test:navigation     # Run navigation tests
npm run test:interaction    # Run interaction tests
npm run test:assertions     # Run assertion tests
\`\`\`

## Test App

The ApiDemos-debug.apk is included in \`apps/\` directory.

## Test Scenarios

All test scenarios are in \`features/scenarios/\`:
- \`comprehensive.feature\` - Complete test suite
- \`01-navigation.feature\` - Navigation tests
- \`02-interactions.feature\` - Element interaction tests
- \`03-assertions.feature\` - Assertion tests

## Writing Your Own Tests

Create new feature files in \`features/\` directory using Gherkin syntax.

### Available Steps

See full list: https://github.com/yourusername/appium-cucumber-steps#available-steps  

## Custom Steps

Add custom step definitions in \`features/step_definitions/custom.steps.js\`

## Using Your Own App

1. Replace \`apps/ApiDemos-debug.apk\` with your app
2. Update \`wdio.conf.js\` app path if needed
3. Create your own feature files with selectors for your app
`,
};

function createDirectory(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`✓ Created ${dir}`);
  }
}

function createFile(filePath: string, content: string) {
  fs.writeFileSync(filePath, content);
  console.log(`✓ Created ${filePath}`);
}

function copyFile(source: string, dest: string) {
  try {
    // Ensure destination directory exists
    const destDir = path.dirname(dest);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    if (fs.existsSync(source)) {
      fs.copyFileSync(source, dest);
      console.log(`✓ Copied ${path.basename(dest)}`);
      return true;
    } else {
      console.log(`⚠ Source not found: ${path.basename(source)}`);
      return false;
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`✗ Failed to copy ${path.basename(dest)}:`, errorMessage);
    return false;
  }
}

function copyDirectory(source: string, destination: string) {
  try {
    if (!fs.existsSync(source)) {
      console.log(`⚠ Source directory not found: ${path.basename(source)}`);
      return false;
    }

    if (!fs.existsSync(destination)) {
      fs.mkdirSync(destination, { recursive: true });
    }

    const files = fs.readdirSync(source);
    files.forEach((file) => {
      const sourceFile = path.join(source, file);
      const destFile = path.join(destination, file);
      const stat = fs.statSync(sourceFile);

      if (stat.isDirectory()) {
        copyDirectory(sourceFile, destFile);
      } else {
        fs.copyFileSync(sourceFile, destFile);
      }
    });

    console.log(`✓ Copied ${path.basename(destination)} directory`);
    return true;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(
      `✗ Failed to copy ${path.basename(destination)}:`,
      errorMessage,
    );
    return false;
  }
}

async function promptUser(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase());
    });
  });
}

async function init() {
  console.log("🚀 Initializing Appium Cucumber project...\n");

  // Get current working directory (where user ran the command)
  const cwd = process.cwd();
  console.log(`📁 Initializing in: ${cwd}\n`);

  // Ask user for TypeScript preference if not specified via flag
  if (useTypeScript === null) {
    const answer = await promptUser(
      "Do you want to use TypeScript? (yes/no) [default: no]: ",
    );
    useTypeScript = answer === "yes" || answer === "y";
  }

  const lang = useTypeScript ? "TypeScript" : "JavaScript";
  const ext = useTypeScript ? "ts" : "js";
  console.log(`✓ Using ${lang}\n`);

  // Create directories in user's project root
  createDirectory("features");
  createDirectory("features/step_definitions");
  createDirectory("features/support");
  createDirectory("apps");

  // Create files based on language choice
  if (useTypeScript) {
    createFile("wdio.conf.ts", templates.wdioConfigTS);
    createFile("features/step_definitions/hooks.ts", templates.hooksTS);
    createFile("features/step_definitions/steps.ts", templates.stepsTS);
    createFile("features/support/world.ts", templates.worldTS);
    createFile("tsconfig.json", templates.tsconfig);
  } else {
    createFile("wdio.conf.js", templates.wdioConfig);
    createFile("features/step_definitions/hooks.js", templates.hooks);
    createFile("features/step_definitions/steps.js", templates.steps);
    createFile("features/support/world.js", templates.world);

    // Remove tsconfig.json if it exists (user chose JS)
    if (fs.existsSync("tsconfig.json")) {
      fs.unlinkSync("tsconfig.json");
      console.log("✓ Removed tsconfig.json (not needed for JavaScript)");
    }
  }

  createFile("README.md", templates.readme);

  // Update or create package.json
  console.log("\n📦 Setting up package.json...");

  // Look for the tarball in the parent directory (where npm pack creates it)
  let tarballPath = "";
  const possiblePaths = [
    path.join(packageRoot, "appium-cucumber-steps-*.tgz"),
    path.join(packageRoot, "..", "appium-cucumber-steps-*.tgz"), // One level up from packageRoot
    path.join(process.cwd(), "..", "appium-cucumber-steps-*.tgz"), // One level up from current dir
    path.join(process.cwd(), "appium-cucumber-steps-*.tgz"), // Current directory
  ];

  for (const pattern of possiblePaths) {
    try {
      const dirPath = path.dirname(pattern);
      if (fs.existsSync(dirPath)) {
        const dirContents = fs.readdirSync(dirPath);
        const matches = dirContents.filter(
          (file) =>
            file.startsWith("appium-cucumber-steps-") && file.endsWith(".tgz"),
        );

        if (matches.length > 0) {
          // Find the most recent tarball
          const sortedMatches = matches.sort((a, b) => {
            const statA = fs.statSync(path.join(dirPath, a));
            const statB = fs.statSync(path.join(dirPath, b));
            return statB.mtime.getTime() - statA.mtime.getTime(); // Sort by modification time (newest first)
          });

          tarballPath = path.relative(
            process.cwd(),
            path.join(dirPath, sortedMatches[0]),
          );
          console.log(`✅ Found tarball: ${tarballPath}`);
          break;
        }
      }
    } catch (error) {
      // Directory might not exist, continue to next path
      continue;
    }
  }

  if (!tarballPath) {
    console.warn(
      "⚠️  Tarball not found. Please run 'npm pack' in the appium-cucumber-steps directory first.",
    );
    console.log("Looking for files like: appium-cucumber-steps-*.tgz");
    console.log(
      "Expected location: ",
      path.join(packageRoot, "appium-cucumber-steps-*.tgz"),
    );
    console.log("Current directory: ", process.cwd());
    console.log("Package root: ", packageRoot);
  }

  if (fs.existsSync("package.json")) {
    try {
      const existingPkg = JSON.parse(fs.readFileSync("package.json", "utf8"));

      // Ensure dependencies exists before accessing it
      if (!existingPkg.dependencies) {
        existingPkg.dependencies = {};
      }

      if (tarballPath) {
        existingPkg.dependencies["appium-cucumber-steps"] =
          `file:${tarballPath}`;
      } else {
        // Fallback to file reference if tarball not found
        existingPkg.dependencies["appium-cucumber-steps"] =
          "file:../../../appium-cucumber-steps-1.0.0.tgz";
      }

      // Add devDependencies for appium if not present
      if (!existingPkg.devDependencies) {
        existingPkg.devDependencies = {};
      }

      // Use the correct version of appium based on your package.json
      existingPkg.devDependencies.appium = "^3.1.2";

      // Only add type: commonjs for JavaScript projects
      if (!useTypeScript) {
        existingPkg.type = "commonjs";
      }

      // Use npx in scripts to ensure commands are available
      const configFile = useTypeScript ? "wdio.conf.ts" : "wdio.conf.js";
      existingPkg.scripts = {
        ...existingPkg.scripts,
        test: `npx wdio run ${configFile}`,
        "test:smoke": `npx wdio run ${configFile} --cucumberOpts.tags='@smoke'`,
        "test:navigation": `npx wdio run ${configFile} --cucumberOpts.tags='@navigation'`,
        "test:interaction": `npx wdio run ${configFile} --cucumberOpts.tags='@interaction'`,
        "test:assertions": `npx wdio run ${configFile} --cucumberOpts.tags='@assertions'`,
        appium: "npx appium",
      };
      fs.writeFileSync("package.json", JSON.stringify(existingPkg, null, 2));
      console.log("✓ Updated package.json");
    } catch (error) {
      console.error("⚠ Failed to update package.json");
    }
  } else {
    // Create package.json with the appropriate tarball reference
    const pkgContent: any = {
      name: "my-appium-tests",
      version: "1.0.0",
      type: "commonjs",
      dependencies: {},
      devDependencies: {
        appium: "^3.1.2",
      },
      scripts: {
        test: "npx wdio run wdio.conf.js",
        "test:smoke": "npx wdio run wdio.conf.js --cucumberOpts.tags='@smoke'",
        "test:navigation":
          "npx wdio run wdio.conf.js --cucumberOpts.tags='@navigation'",
        "test:interaction":
          "npx wdio run wdio.conf.js --cucumberOpts.tags='@interaction'",
        "test:assertions":
          "npx wdio run wdio.conf.js --cucumberOpts.tags='@assertions'",
        appium: "npx appium",
      },
    };

    if (tarballPath) {
      pkgContent.dependencies["appium-cucumber-steps"] = `file:${tarballPath}`;
    } else {
      // Fallback to file reference if tarball not found
      pkgContent.dependencies["appium-cucumber-steps"] =
        "file:../../../appium-cucumber-steps-1.0.0.tgz";
    }

    createFile("package.json", JSON.stringify(pkgContent, null, 2));
  }

  // Copy APK from package to user's project root
  console.log("\n📱 Setting up test app...");
  const userApkPath = path.join(cwd, "apps", "ApiDemos-debug.apk");

  // Check if source APK exists before copying
  if (fs.existsSync(apkSource)) {
    const apkCopied = copyFile(apkSource, userApkPath);
    if (!apkCopied) {
      console.log("⚠ ApiDemos-debug.apk not found in package.");
      console.log("  You can download it manually from:");
      console.log(
        "  https://github.com/appium/appium/raw/master/packages/appium/sample-code/apps/ApiDemos-debug.apk  ",
      );
      console.log(`  Save it to: ${userApkPath}`);
    }
  } else {
    console.log(`⚠ Source APK not found at: ${apkSource}`);
    console.log("  You can download it manually from:");
    console.log(
      "  https://github.com/appium/appium/raw/master/packages/appium/sample-code/apps/ApiDemos-debug.apk  ",
    );
    console.log(`  Save it to: ${userApkPath}`);
  }

  // Copy test scenarios from package to user's project root
  console.log("\n📋 Setting up test scenarios...");
  const userScenariosPath = path.join(cwd, "features", "scenarios");

  // Check if source scenarios directory exists before copying
  if (fs.existsSync(scenariosSource)) {
    const scenariosCopied = copyDirectory(scenariosSource, userScenariosPath);
    if (!scenariosCopied) {
      console.log(`⚠ Source scenarios not found at: ${scenariosSource}`);
      console.log("  Creating empty scenarios directory...");
      createDirectory(userScenariosPath);
    }
  } else {
    console.log(`⚠ Source scenarios not found at: ${scenariosSource}`);
    console.log("  Creating empty scenarios directory...");
    createDirectory(userScenariosPath);
  }

  console.log("\n✅ Project initialized successfully!\n");
  console.log(
    "📱 Test app:",
    fs.existsSync(userApkPath)
      ? "apps/ApiDemos-debug.apk ✓"
      : "apps/ApiDemos-debug.apk (manual download needed)",
  );
  console.log("📚 Test scenarios: features/scenarios/\n");
  console.log("⚠️  IMPORTANT: Make sure appium-cucumber-steps is installed:");
  console.log(
    "   If you used 'npm link', the dependencies won't be available.",
  );
  console.log("   Install it properly: npm install appium-cucumber-steps\n");
  console.log("Next steps:");
  console.log(
    "1. Make sure you have run 'npm pack' in the appium-cucumber-steps directory",
  );
  console.log("2. Install dependencies: npm install");
  console.log("3. Start Android emulator");
  console.log("4. Install driver: npx appium driver install uiautomator2");
  console.log("5. Start Appium: npm run appium");
  console.log("6. Run tests: npm run test\n");
  console.log("Run specific tests:");
  console.log("  npm run test:smoke");
  console.log("  npm run test:navigation");
  console.log("  npm run test:interaction");
  console.log("  npm run test:assertions\n");
}

init();
