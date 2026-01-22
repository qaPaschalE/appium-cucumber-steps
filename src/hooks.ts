import { After, Status } from "@cucumber/cucumber";
import { driver } from "@wdio/globals";

/**
 * Automatically takes a screenshot if a scenario fails.
 * This is bundled into the npm package so users get it for free.
 */
After(async function (scenario) {
  if (scenario.result?.status === Status.FAILED) {
    // Take the screenshot from the mobile device
    const screenshot = await driver.takeScreenshot();

    // Attach it to the Cucumber report (this.attach is a Cucumber context method)
    this.attach(screenshot, "image/png");

    console.log(
      `📸 Screenshot captured for failed scenario: ${scenario.pickle.name}`
    );
  }
});
