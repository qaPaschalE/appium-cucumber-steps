import { When, Then } from "@cucumber/cucumber";
import { AppiumWorld } from "../support/world";

When("I tap on {string}", async function (this: AppiumWorld, selector: string) {
  const element = await this.driver.$(selector);
  await element.waitForDisplayed({ timeout: 10000 });
  await element.click();
});

When(
  "I tap on {string} element",
  async function (this: AppiumWorld, accessibilityId: string) {
    const element = await this.driver.$(`~${accessibilityId}`);
    await element.waitForDisplayed({ timeout: 10000 });
    await element.click();
  },
);

When(
  "I double tap on {string}",
  async function (this: AppiumWorld, selector: string) {
    const element = await this.driver.$(selector);
    await element.waitForDisplayed({ timeout: 10000 });
    await element.doubleClick();
  },
);

When(
  "I long press on {string}",
  async function (this: AppiumWorld, selector: string) {
    const element = await this.driver.$(selector);
    await element.waitForDisplayed({ timeout: 10000 });
    await element.touchAction([
      { action: "press" },
      { action: "wait", ms: 1000 },
      { action: "release" },
    ]);
  },
);

When(
  "I enter {string} into {string}",
  async function (this: AppiumWorld, text: string, selector: string) {
    const element = await this.driver.$(selector);
    await element.waitForDisplayed({ timeout: 10000 });
    await element.setValue(text);
  },
);

When("I clear {string}", async function (this: AppiumWorld, selector: string) {
  const element = await this.driver.$(selector);
  await element.waitForDisplayed({ timeout: 10000 });
  await element.clearValue();
});

When(
  "I append {string} to {string}",
  async function (this: AppiumWorld, text: string, selector: string) {
    const element = await this.driver.$(selector);
    await element.waitForDisplayed({ timeout: 10000 });
    await element.addValue(text);
  },
);

When(
  "I swipe {string} on {string}",
  async function (this: AppiumWorld, direction: string, selector: string) {
    const element = await this.driver.$(selector);
    await element.waitForDisplayed({ timeout: 10000 });

    const location = await element.getLocation();
    const size = await element.getSize();

    const centerX = location.x + size.width / 2;
    const centerY = location.y + size.height / 2;

    let startX = centerX;
    let startY = centerY;
    let endX = centerX;
    let endY = centerY;

    switch (direction.toLowerCase()) {
      case "up":
        startY = location.y + size.height - 10;
        endY = location.y + 10;
        break;
      case "down":
        startY = location.y + 10;
        endY = location.y + size.height - 10;
        break;
      case "left":
        startX = location.x + size.width - 10;
        endX = location.x + 10;
        break;
      case "right":
        startX = location.x + 10;
        endX = location.x + size.width - 10;
        break;
    }

    await this.driver.touchAction([
      { action: "press", x: startX, y: startY },
      { action: "wait", ms: 200 },
      { action: "moveTo", x: endX, y: endY },
      { action: "release" },
    ]);
  },
);

When(
  "I scroll to {string}",
  async function (this: AppiumWorld, selector: string) {
    const element = await this.driver.$(selector);
    await element.scrollIntoView();
  },
);

When("I hide keyboard", async function (this: AppiumWorld) {
  await this.driver.hideKeyboard();
});

When(
  "I select {string} from {string} picker",
  async function (this: AppiumWorld, value: string, selector: string) {
    const element = await this.driver.$(selector);
    await element.waitForDisplayed({ timeout: 10000 });

    if (this.platform === "ios") {
      await this.driver.execute("mobile: selectPickerWheelValue", {
        element: await element.elementId,
        order: "next",
        offset: 0.15,
      });
    } else {
      await element.setValue(value);
    }
  },
);
