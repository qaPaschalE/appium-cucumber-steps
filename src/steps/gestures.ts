import { $, driver } from "@wdio/globals";
import { When, Given } from "@cucumber/cucumber";

/**
 * Taps on a mobile element using its Accessibility ID.
 * * @example When I tap on the element with id "login_button"
 * @param elementId The accessibility ID
 */
export async function tapElement(elementId: string): Promise<void> {
  const el = await $(`~${elementId}`);
  await el.waitForDisplayed({ timeout: 5000 });
  await el.click();
}
// THE GLUE: This is what the .feature file "sees"
When("I tap on the element with id {string}", tapElement);

/**
 * Performs a vertical swipe/scroll on the mobile screen.
 * * @example Given I swipe "up" on the screen
 * @param direction The direction to move ('up', 'down', 'left', 'right')
 */
export async function swipe(
  direction: "up" | "down" | "left" | "right"
): Promise<void> {
  await driver.execute("mobile: scroll", { direction });
}
// THE GLUE:
Given("I swipe {string} on the screen", swipe);

/**
 * Long presses on an element for a specific duration.
 * * @example When I long press on "profile_picture" for 3000ms
 * @param elementId Accessibility ID
 * @param duration Duration in ms
 */
export async function longPress(
  elementId: string,
  duration: number = 1000
): Promise<void> {
  const el = await $(`~${elementId}`);
  await driver
    .action("pointer")
    .move({ duration: 0, origin: el })
    .down({ button: 0 })
    .pause(duration)
    .up({ button: 0 })
    .perform();
}
// THE GLUE:
When("I long press on {string} for {int}ms", longPress);
