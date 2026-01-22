import { Then } from "@cucumber/cucumber";
import { AppiumWorld } from "../support/world";
import { expect } from "@wdio/globals";

Then(
  "I should see {string}",
  async function (this: AppiumWorld, selector: string) {
    const element = await this.driver.$(selector);
    await element.waitForDisplayed({ timeout: 10000 });
    await expect(element).toBeDisplayed();
  },
);

Then(
  "I should not see {string}",
  async function (this: AppiumWorld, selector: string) {
    const element = await this.driver.$(selector);
    await expect(element).not.toBeDisplayed();
  },
);

Then(
  "I should see {string} element",
  async function (this: AppiumWorld, accessibilityId: string) {
    const element = await this.driver.$(`~${accessibilityId}`);
    await element.waitForDisplayed({ timeout: 10000 });
    await expect(element).toBeDisplayed();
  },
);

Then(
  "{string} should contain text {string}",
  async function (this: AppiumWorld, selector: string, expectedText: string) {
    const element = await this.driver.$(selector);
    await element.waitForDisplayed({ timeout: 10000 });
    const actualText = await element.getText();
    expect(actualText).toContain(expectedText);
  },
);

Then(
  "{string} should have exact text {string}",
  async function (this: AppiumWorld, selector: string, expectedText: string) {
    const element = await this.driver.$(selector);
    await element.waitForDisplayed({ timeout: 10000 });
    const actualText = await element.getText();
    expect(actualText).toBe(expectedText);
  },
);

Then(
  "{string} should be enabled",
  async function (this: AppiumWorld, selector: string) {
    const element = await this.driver.$(selector);
    await element.waitForDisplayed({ timeout: 10000 });
    await expect(element).toBeEnabled();
  },
);

Then(
  "{string} should be disabled",
  async function (this: AppiumWorld, selector: string) {
    const element = await this.driver.$(selector);
    await element.waitForDisplayed({ timeout: 10000 });
    await expect(element).toBeDisabled();
  },
);

Then(
  "{string} should exist",
  async function (this: AppiumWorld, selector: string) {
    const element = await this.driver.$(selector);
    await expect(element).toExist();
  },
);

Then(
  "{string} should not exist",
  async function (this: AppiumWorld, selector: string) {
    const element = await this.driver.$(selector);
    await expect(element).not.toExist();
  },
);

Then(
  "{string} should be selected",
  async function (this: AppiumWorld, selector: string) {
    const element = await this.driver.$(selector);
    await element.waitForDisplayed({ timeout: 10000 });
    const isSelected = await element.isSelected();
    expect(isSelected).toBe(true);
  },
);

Then(
  "I should see {int} {string} elements",
  async function (this: AppiumWorld, count: number, selector: string) {
    const elements = await this.driver.$$(selector);
    expect(elements.length).toBe(count);
  },
);

Then(
  "{string} value should be {string}",
  async function (this: AppiumWorld, selector: string, expectedValue: string) {
    const element = await this.driver.$(selector);
    await element.waitForDisplayed({ timeout: 10000 });
    const actualValue = await element.getValue();
    expect(actualValue).toBe(expectedValue);
  },
);

Then(
  "I wait until {string} is displayed",
  async function (this: AppiumWorld, selector: string) {
    const element = await this.driver.$(selector);
    await element.waitForDisplayed({ timeout: 30000 });
  },
);

Then(
  "I wait until {string} is not displayed",
  async function (this: AppiumWorld, selector: string) {
    const element = await this.driver.$(selector);
    await element.waitForDisplayed({ timeout: 30000, reverse: true });
  },
);
