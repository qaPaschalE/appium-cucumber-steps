// Export World class
export { AppiumWorld } from "./support/world";

// Export types
export * from "./types";

// Re-export WebDriverIO and Cucumber for convenience
export { remote } from "webdriverio";
export {
  setWorldConstructor,
  Before,
  After,
  Given,
  When,
  Then,
  Status,
} from "@cucumber/cucumber";

// DO NOT auto-import step definitions here
// They should be imported by the user's cucumber configuration
