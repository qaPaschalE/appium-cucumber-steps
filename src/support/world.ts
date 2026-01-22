import { World, IWorldOptions } from "@cucumber/cucumber";
import type { Browser } from "webdriverio";

export class AppiumWorld extends World {
  public driver!: Browser;
  public platform!: "android" | "ios";

  constructor(options: IWorldOptions) {
    super(options);
  }

  async setDriver(driver: Browser, platform: "android" | "ios") {
    this.driver = driver;
    this.platform = platform;
  }

  async getElement(selector: string) {
    return await this.driver.$(selector);
  }

  async getElements(selector: string) {
    return await this.driver.$$(selector);
  }
}
