# Testing appium-cucumber-steps

## Quick Test Setup

### Step 1: Build Your Package

```bash
cd appium-cucumber-steps
npm install
npm run build
npm link
```

### Step 2: Create Test Project

```bash
mkdir ../test-project
cd ../test-project
npm init -y
```

### Step 3: Install Minimal Dependencies

```bash
# Link your local package
npm link appium-cucumber-steps

# Install Appium globally (if not already installed)
npm install -g appium
appium driver install uiautomator2
```

### Step 4: Initialize Project

```bash
npx appium-cucumber-init
```

This creates all necessary files automatically!

### Step 5: Download Test App

```bash
# Android API Demos app
curl -L https://github.com/appium/appium/raw/master/packages/appium/sample-code/apps/ApiDemos-debug.apk -o app.apk
```

### Step 6: Update Configuration

Edit `wdio.conf.ts` and update the app path:

```typescript
'appium:app': './app.apk',
```

### Step 7: Run Tests

```bash
# Terminal 1: Start Appium
appium

# Terminal 2: Start Android Emulator
emulator -avd <your_avd_name>

# Terminal 3: Run tests
npm test
```

## Test Project Structure

After running `appium-cucumber-init`, you'll have:

```
test-project/
├── features/
│   ├── step_definitions/
│   │   └── hooks.ts              # Generated
│   ├── support/
│   │   └── world.ts              # Generated
│   └── sample.feature            # Generated
├── wdio.conf.ts                  # Generated
├── tsconfig.json                 # Generated
├── README.md                     # Generated
├── package.json                  # Updated
└── app.apk                       # Your app
```

## Create Custom Feature Files

Replace `features/sample.feature` with real tests:

```gherkin
Feature: API Demos Navigation

  Scenario: Navigate to Views
    Given I launch the app
    When I tap on "//android.widget.TextView[@text='Views']"
    Then I should see "//android.widget.TextView[@text='Animation']"

  Scenario: Test text input
    Given I launch the app
    When I tap on "//android.widget.TextView[@text='Views']"
    And I tap on "//android.widget.TextView[@text='Auto Complete']"
    And I tap on "//android.widget.TextView[@text='1. Screen Top']"
    When I enter "United States" into "//android.widget.AutoCompleteTextView"
    Then "//android.widget.AutoCompleteTextView" should contain text "United States"
```

## Testing iOS

### Update `wdio.conf.ts`:

```typescript
capabilities: [
  {
    platformName: "iOS",
    "appium:deviceName": "iPhone 14",
    "appium:platformVersion": "16.0",
    "appium:app": "./YourApp.app",
    "appium:automationName": "XCUITest",
  },
];
```

### Update hooks:

```typescript
Before(async function (this: AppiumWorld) {
  await this.setDriver(browser as any, "ios");
});
```

## Manual Test (Without Init Script)

If you prefer manual setup:

### 1. Create `package.json`:

```json
{
  "name": "test-project",
  "scripts": {
    "test": "wdio run wdio.conf.ts"
  }
}
```

### 2. Create `wdio.conf.ts`:

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
      "appium:app": "./app.apk",
      "appium:automationName": "UiAutomator2",
    },
  ],
  logLevel: "info",
  framework: "cucumber",
  reporters: ["spec"],
  services: ["appium"],
  cucumberOpts: {
    require: ["node_modules/appium-cucumber-steps/dist/index.js"],
    timeout: 60000,
  },
};
```

### 3. Create feature file:

```bash
mkdir -p features
echo 'Feature: Test
  Scenario: Launch
    Given I launch the app' > features/test.feature
```

### 4. Run:

```bash
npm test
```

## Testing Before Publishing

### Method 1: Local tarball (Recommended - Production-like)

```bash
# In package directory
npm run build
npm pack
# Creates: appium-cucumber-steps-1.0.0.tgz

# In test project
mkdir ../test-project
cd ../test-project
npm init -y
npm install ../appium-cucumber-steps/appium-cucumber-steps-1.0.0.tgz
npx appium-cucumber-init
npm test
```

### Method 2: Quick test script

```bash
# In package directory
chmod +x scripts/test-local.sh
./scripts/test-local.sh

# Then
cd ../test-local-install
npm test
```

### ⚠️ Why not npm link?

`npm link` doesn't properly resolve dependencies for the linked package. The user project won't have access to reporters and other dependencies. Always test with `npm pack` and install from tarball before publishing.

## Verify All Steps Work

Create `features/all-steps.feature`:

```gherkin
Feature: Verify All Steps

  @navigation
  Scenario: Test navigation steps
    Given I launch the app
    When I wait for 2 seconds
    Then I should see "//android.widget.TextView"
    When I navigate back

  @interaction
  Scenario: Test element interaction
    Given I launch the app
    When I tap on "//android.widget.TextView[@text='Views']"
    Then I should see "//android.widget.TextView[@text='Animation']"

  @assertions
  Scenario: Test assertions
    Given I launch the app
    Then "//android.widget.TextView[@text='API Demos']" should exist
    And "//android.widget.TextView[@text='API Demos']" should be enabled
```

Run specific scenarios:

```bash
npx wdio run wdio.conf.ts --cucumberOpts.tagExpression='@navigation'
```

## Expected Output

```
[android emulator-5554 #0-0] Running: android
[android emulator-5554 #0-0]
[android emulator-5554 #0-0] Feature: Test
[android emulator-5554 #0-0]
[android emulator-5554 #0-0]   Scenario: Launch
[android emulator-5554 #0-0]     ✓ Given I launch the app
[android emulator-5554 #0-0]
[android emulator-5554 #0-0] 1 passing (3.2s)
```

## Debugging

### Enable verbose logging:

```typescript
// wdio.conf.ts
logLevel: "debug";
```

### Run specific feature:

```bash
npx wdio run wdio.conf.ts --spec features/test.feature
```

### Interactive debugging:

Add to your feature:

```gherkin
When I wait for 300 seconds  # Gives you time to inspect
```

## What Users Need to Install

✅ Only your package:

```bash
npm install appium-cucumber-steps
```

✅ Global Appium (one-time):

```bash
npm install -g appium
appium driver install uiautomator2
```

❌ No need for:

- webdriverio
- @wdio/cli
- @cucumber/cucumber
- @wdio/cucumber-framework
- Any other WDIO packages

Everything is bundled in your package!

## Publishing Checklist

Before publishing to npm:

- [ ] `npm run build` succeeds
- [ ] Test with `npm link` in separate project
- [ ] Test with `npm pack` and local install
- [ ] `npx appium-cucumber-init` works
- [ ] All sample scenarios pass
- [ ] Both Android and iOS configs tested (if possible)
- [ ] README is clear and complete
- [ ] Version number updated in package.json

## Publishing

```bash
npm login
npm publish
```

## After Publishing

Test the published package:

```bash
mkdir test-published
cd test-published
npm init -y
npm install appium-cucumber-steps
npx appium-cucumber-init
# Add app and run tests
npm test
```
