## Using Your Own App

The bundled ApiDemos app is great for learning and testing, but you can easily use your own app:

1. **Replace the APK:**

   ```bash
   # Copy your app
   cp /path/to/your/app.apk apps/MyApp.apk
   ```

2. **Update `wdio.conf.ts`:**

   ```typescript
   'appium:app': path.join(__dirname, 'apps', 'MyApp.apk'),
   ```

3. **Update selectors in your feature files** to match your app's elements

4. **Run tests:**
   ````bash
   npm test
   ```# Appium Cucumber Steps
   ````

Pre-built Cucumber step definitions for Appium mobile testing with TypeScript support. Everything you need in one package - including a test app!

## ✨ What's Included

✅ **30+ Pre-built Steps** - Ready-to-use Cucumber steps  
✅ **Test App Bundled** - ApiDemos APK included  
✅ **Comprehensive Examples** - Full test scenarios  
✅ **Auto-Setup** - One command initialization  
✅ **All Dependencies** - WebDriverIO, Cucumber, etc.  
✅ **TypeScript Support** - Full type definitions  
✅ **Cross-Platform** - Android & iOS support

## Installation

```bash
npm install appium-cucumber-steps
```

**Important:** The package must be installed (not just linked) for all dependencies to work correctly.

That's it! All dependencies (WebDriverIO, Cucumber, test app) are included.

## Global Setup (One-time)

Install Appium globally and the driver you need:

```bash
# Install Appium globally
npm install -g appium

# Install driver
appium driver install uiautomator2  # For Android
appium driver install xcuitest      # For iOS (macOS only)
```

Then for each project:

```bash
# 1. Install package
npm install appium-cucumber-steps

# 2. Initialize
npx appium-cucumber-init

# 3. Run tests
npm test
```

## Quick Start

### Auto-generate Project (Recommended)

```bash
# 1. Install the package
npm install appium-cucumber-steps

# 2. Initialize your project
npx appium-cucumber-init
# You'll be asked: "Do you want to use TypeScript? (yes/no)"

# Or skip the prompt with flags:
npx appium-cucumber-init --javascript  # Use JavaScript
npx appium-cucumber-init --typescript  # Use TypeScript

# 3. Run tests
npm test
```

That's it! Three commands and you're testing.

This creates:

- ✅ Complete project structure
- ✅ **ApiDemos-debug.apk** (test app)
- ✅ Sample test scenarios
- ✅ Comprehensive test examples
- ✅ All configuration files

Then just:

1. Start Appium: `appium`
2. Start emulator
3. Run tests: `npm test`

### Test Scenarios Included

After initialization, you get:

```
your-project/
├── apps/
│   └── ApiDemos-debug.apk        # Ready-to-use test app!
├── features/
│   ├── examples/                  # Comprehensive test suite
│   │   ├── comprehensive.feature  # All steps tested
│   │   ├── 01-navigation.feature  # Navigation tests
│   │   ├── 02-interactions.feature # Interaction tests
│   │   └── 03-assertions.feature  # Assertion tests
│   └── sample.feature             # Quick start tests
└── wdio.conf.ts                   # Pre-configured
```

Run tests by category:

```bash
npm test                    # All tests
npm run test:smoke          # Smoke tests only
npm run test:navigation     # Navigation tests
npm run test:interaction    # Interaction tests
npm run test:assertions     # Assertion tests
```

### Option 2: Manual Setup

If you prefer manual setup or want to use your own app:

#### 1. Create Project Structure

```
your-project/
├── features/
│   ├── step_definitions/
│   │   └── hooks.ts
│   ├── support/
│   │   └── world.ts
│   └── login.feature
├── wdio.conf.ts
├── tsconfig.json
└── package.json
```

#### 2. Configure WebDriverIO (`wdio.conf.ts`)

```typescript
import type { Options } from "@wdio/types";

export const config: Options.Testrunner = {
  runner: "local",
  specs: ["./features/**/*.feature"],
  maxInstances: 1,
  capabilities: [
    {
      platformName: "Android",
      "appium:deviceName": "emulator-5554",
      "appium:app": "/path/to/your/app.apk",
      "appium:automationName": "UiAutomator2",
    },
  ],
  logLevel: "info",
  framework: "cucumber",
  reporters: ["spec"],
  services: ["appium"],
  cucumberOpts: {
    require: [
      "node_modules/appium-cucumber-steps/dist/index.js",
      "./features/step_definitions/**/*.ts",
    ],
    requireModule: ["ts-node/register"],
    timeout: 60000,
  },
};
```

#### 3. Set Up World (`features/support/world.ts`)

```typescript
import { setWorldConstructor, AppiumWorld } from "appium-cucumber-steps";

setWorldConstructor(AppiumWorld);
```

#### 4. Create Hooks (`features/step_definitions/hooks.ts`)

```typescript
import { Before, After, Status } from "appium-cucumber-steps";
import { AppiumWorld } from "appium-cucumber-steps";

Before(async function (this: AppiumWorld) {
  await this.setDriver(browser as any, "android");
});

After(async function (this: AppiumWorld, scenario) {
  if (scenario.result?.status === Status.FAILED) {
    const screenshot = await this.driver.takeScreenshot();
    this.attach(screenshot, "image/png");
  }
});
```

#### 5. Write Feature File (`features/login.feature`)

```gherkin
Feature: User Login

  Scenario: Successful login
    Given I launch the app
    When I enter "user@example.com" into "~email-input"
    And I enter "password123" into "~password-input"
    And I tap on "~login-button"
    Then I should see "~home-screen"
```

#### 6. Configure TypeScript (`tsconfig.json`)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "moduleResolution": "node10",
    "types": ["node", "@wdio/globals/types"]
  },
  "include": ["features/**/*", "wdio.conf.ts"]
}
```

#### 7. Update `package.json`

```json
{
  "scripts": {
    "test": "wdio run wdio.conf.ts"
  }
}
```

#### 8. Run Tests

```bash
# Start Appium (in separate terminal)
appium

# Run tests
npm test
```

## Available Steps

### Navigation Steps

- `Given I launch the app`
- `When I navigate back`
- `When I wait for {int} seconds`
- `When I restart the app`
- `When I close the app`
- `When I launch the app again`
- `When I put the app in background for {int} seconds`
- `When I shake the device`
- `When I lock the device`
- `When I unlock the device`
- `When I rotate the device to {string}` (PORTRAIT/LANDSCAPE)

### Element Interaction Steps

- `When I tap on {string}` - Tap by selector
- `When I tap on {string} element` - Tap by accessibility ID
- `When I double tap on {string}`
- `When I long press on {string}`
- `When I enter {string} into {string}` - Enter text
- `When I clear {string}` - Clear text field
- `When I append {string} to {string}` - Append text
- `When I swipe {string} on {string}` - Swipe (up/down/left/right)
- `When I scroll to {string}`
- `When I hide keyboard`
- `When I select {string} from {string} picker`

### Assertion Steps

- `Then I should see {string}` - Element is visible
- `Then I should not see {string}`
- `Then I should see {string} element` - By accessibility ID
- `Then {string} should contain text {string}`
- `Then {string} should have exact text {string}`
- `Then {string} should be enabled`
- `Then {string} should be disabled`
- `Then {string} should exist`
- `Then {string} should not exist`
- `Then {string} should be selected`
- `Then I should see {int} {string} elements` - Count elements
- `Then {string} value should be {string}`
- `Then I wait until {string} is displayed`
- `Then I wait until {string} is not displayed`

## Selector Strategies

- `~accessibilityId` - Accessibility ID
- `//xpath` - XPath
- `id=resourceId` - Resource ID
- Plain text for other strategies

Examples:

```gherkin
When I tap on "~login-button"                                    # Accessibility ID
When I tap on "//android.widget.Button[@text='Login']"          # XPath
When I tap on "id=com.example:id/submit"                        # Resource ID
```

## iOS Configuration

Update capabilities in `wdio.conf.ts`:

```typescript
capabilities: [
  {
    platformName: "iOS",
    "appium:deviceName": "iPhone 14",
    "appium:platformVersion": "16.0",
    "appium:app": "/path/to/your/app.app",
    "appium:automationName": "XCUITest",
  },
];
```

And in hooks:

```typescript
await this.setDriver(browser as any, "ios");
```

## Custom Steps

Add your own steps alongside the pre-built ones:

```typescript
// features/step_definitions/custom.steps.ts
import { Given } from "appium-cucumber-steps";
import { AppiumWorld } from "appium-cucumber-steps";

Given("I perform custom action", async function (this: AppiumWorld) {
  const element = await this.driver.$("~custom-element");
  await element.click();
});
```

## What's Included

✅ WebDriverIO - No need to install separately  
✅ Cucumber - Built-in BDD framework  
✅ Appium Service - Auto-starts Appium  
✅ TypeScript Support - Full type definitions  
✅ Pre-built Steps - 30+ ready-to-use steps  
✅ Screenshot on Failure - Automatic capture  
✅ Cross-platform - Android & iOS support

## Minimal Installation

Your users only need:

```bash
# Your test project
npm install appium-cucumber-steps

# Global Appium (one-time)
npm install -g appium
appium driver install uiautomator2
```

No need to install WebDriverIO, Cucumber, or any other dependencies separately!

## Example Test Scenarios

The package includes comprehensive test scenarios covering all features:

### Navigation Tests

```gherkin
Scenario: Navigate forward and backward
  Given I launch the app
  When I tap on "//android.widget.TextView[@text='Views']"
  Then I should see "//android.widget.TextView[@text='Animation']"
  When I navigate back
  Then I should see "//android.widget.TextView[@text='API Demos']"
```

### Interaction Tests

```gherkin
Scenario: Enter and verify text
  When I tap on "//android.widget.TextView[@text='Views']"
  And I tap on "//android.widget.TextView[@text='Auto Complete']"
  And I enter "Canada" into "~autocomplete-field"
  Then "~autocomplete-field" should contain text "Canada"
```

### Assertion Tests

```gherkin
Scenario: Multiple assertions
  Then "~app-title" should exist
  And "~app-title" should be enabled
  And "~app-title" should have exact text "API Demos"
  And I should see 1 "~app-title" elements
```

See `features/examples/` for 20+ complete test scenarios!

## Troubleshooting

### "Cannot find module 'appium-cucumber-steps'"

Ensure the package is installed: `npm install appium-cucumber-steps`

### Steps not recognized

Make sure `node_modules/appium-cucumber-steps/dist/index.js` is in your `cucumberOpts.require` array

### "Appium server not running"

Start Appium manually: `appium` (in separate terminal)

### TypeScript errors

Ensure `tsconfig.json` includes `@wdio/globals/types` in the types array

## License

MIT
