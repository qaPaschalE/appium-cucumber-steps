import { $, driver } from "@wdio/globals";
import { When, Then } from "@cucumber/cucumber";

/**
 * Sets the value of a text input or textarea using its Accessibility ID.
 * * @example When I type "my_secret_password" into the "password_input"
 * @param text The string to enter
 * @param elementId The accessibility ID of the input field
 */
export async function typeIntoField(
  text: string,
  elementId: string
): Promise<void> {
  const el = await $(`~${elementId}`);
  await el.waitForDisplayed({ timeout: 5000 });
  await el.setValue(text);
}
// THE GLUE
When("I type {string} into the {string}", typeIntoField);

/**
 * Clears the text from an input field.
 * * @example When I clear the "search_box" field
 * @param elementId The accessibility ID of the field to clear
 */
export async function clearField(elementId: string): Promise<void> {
  const el = await $(`~${elementId}`);
  await el.waitForDisplayed({ timeout: 5000 });
  await el.clearValue();
}
// THE GLUE
When("I clear the {string} field", clearField);

/**
 * Validates that an element is visible on the screen.
 * * @example Then the element "welcome_header" should be visible
 * @param elementId The accessibility ID
 */
export async function checkVisibility(elementId: string): Promise<void> {
  const el = await $(`~${elementId}`);
  const isVisible = await el.isDisplayed();
  if (!isVisible) {
    throw new Error(
      `Assertion Failed: Element with ID "${elementId}" was not visible on the screen.`
    );
  }
}
// THE GLUE
Then("the element {string} should be visible", checkVisibility);

/**
 * Validates the text content of a specific element.
 * * @example Then the element "status_label" should contain the text "Success"
 * @param elementId The accessibility ID
 * @param expectedText The text you expect to see
 */
export async function checkElementText(
  elementId: string,
  expectedText: string
): Promise<void> {
  const el = await $(`~${elementId}`);
  await el.waitForDisplayed({ timeout: 5000 });
  const actualText = await el.getText();
  if (!actualText.includes(expectedText)) {
    throw new Error(
      `Assertion Failed: Expected "${expectedText}" but found "${actualText}"`
    );
  }
}
// THE GLUE
Then("the element {string} should contain the text {string}", checkElementText);

/**
 * Checks if a button or input is enabled.
 * * @example Then the "submit_button" should be enabled
 * @param elementId The accessibility ID
 */
export async function checkElementEnabled(elementId: string): Promise<void> {
  const el = await $(`~${elementId}`);
  const isEnabled = await el.isEnabled();
  if (!isEnabled) {
    throw new Error(
      `Assertion Failed: Element "${elementId}" is currently disabled.`
    );
  }
}
// THE GLUE
Then("the {string} should be enabled", checkElementEnabled);
