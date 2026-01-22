import type { Browser } from "webdriverio";

export interface AppiumWorld {
  driver: Browser;
  platform: "android" | "ios";
}

export interface ElementLocator {
  strategy:
    | "id"
    | "xpath"
    | "accessibility id"
    | "class name"
    | "-android uiautomator"
    | "-ios predicate string";
  selector: string;
}

export interface WaitOptions {
  timeout?: number;
  interval?: number;
}
