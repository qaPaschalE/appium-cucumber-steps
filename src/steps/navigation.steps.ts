import { driver } from "@wdio/globals";
import { Given, When } from "@cucumber/cucumber";
import { AppiumWorld } from "../support/world";

/**
 * Navigates to a specific screen or URL using a Deep Link.
 * * @example When I open the deep link "myapp://settings/profile"
 * @param url The deep link URL
 */
export async function openDeepLink(url: string): Promise<void> {
  await driver.url(url);
}
// THE GLUE
When("I open the deep link {string}", openDeepLink);

/**
 * Puts the application in the background for a certain amount of time.
 * * @example When I put the app in the background for 5 seconds
 * @param seconds Duration in seconds
 */
export async function backgroundApp(seconds: number): Promise<void> {
  await driver.background(seconds);
}
// THE GLUE
When("I put the app in the background for {int} seconds", backgroundApp);

/**
 * Restarts the application to ensure a clean state.
 * * @example Given I restart the application
 */
export async function restartApp(): Promise<void> {
  // Accessing capabilities directly as a property
  const caps = driver.capabilities as any;
  const appId =
    caps["appPackage"] || caps["bundleId"] || caps["testobject_app_id"];

  if (!appId) {
    throw new Error(
      "Could not determine App ID (Package Name or Bundle ID) from driver capabilities.",
    );
  }

  await driver.terminateApp(appId);
  await driver.activateApp(appId);
}
// THE GLUE
Given("I restart the application", restartApp);
/**
 * Navigates back to the previous screen.
 * * @example When I navigate back
 */
export async function navigateBack(): Promise<void> {
  await driver.back();
}
// THE GLUE
When("I navigate back", navigateBack);

/**
 * Hides the software keyboard if it is currently visible.
 * * @example When I hide the keyboard
 */
export async function hideKeyboard(): Promise<void> {
  const isKeyboardShown = await driver.isKeyboardShown();
  if (isKeyboardShown) {
    await driver.hideKeyboard();
  }
}
// THE GLUE
When("I hide the keyboard", hideKeyboard);

/**
 * Rotates the device to a specific orientation.
 * * @example When I rotate the device to "LANDSCAPE"
 * @param orientation Either 'PORTRAIT' or 'LANDSCAPE'
 */
export async function rotateDevice(
  orientation: "PORTRAIT" | "LANDSCAPE",
): Promise<void> {
  await driver.setOrientation(orientation);
}
// THE GLUE
When("I rotate the device to {string}", rotateDevice);

Given("I launch the app", async function (this: AppiumWorld) {
  if (!this.driver) {
    throw new Error(
      "Driver not initialized. Please ensure driver is set up in hooks.",
    );
  }
  // App should already be launched by Appium capabilities
  await this.driver.pause(1000);
});

When("I navigate back", async function (this: AppiumWorld) {
  await this.driver.back();
});

When(
  "I wait for {int} seconds",
  async function (this: AppiumWorld, seconds: number) {
    await this.driver.pause(seconds * 1000);
  },
);

When("I restart the app", async function (this: AppiumWorld) {
  await this.driver.closeApp();
  await this.driver.pause(1000);
  await this.driver.launchApp();
});

When("I close the app", async function (this: AppiumWorld) {
  await this.driver.closeApp();
});

When("I launch the app again", async function (this: AppiumWorld) {
  await this.driver.launchApp();
});

When(
  "I put the app in background for {int} seconds",
  async function (this: AppiumWorld, seconds: number) {
    await this.driver.background(seconds);
  },
);

When("I shake the device", async function (this: AppiumWorld) {
  await this.driver.shake();
});

When("I lock the device", async function (this: AppiumWorld) {
  await this.driver.lock();
});

When("I unlock the device", async function (this: AppiumWorld) {
  await this.driver.unlock();
});

When(
  "I rotate the device to {string}",
  async function (this: AppiumWorld, orientation: string) {
    const validOrientation = orientation.toUpperCase() as
      | "LANDSCAPE"
      | "PORTRAIT";
    await this.driver.setOrientation(validOrientation);
  },
);
