Feature: Assertion Tests

    Background:
        Given I launch the app
        And I wait for 2 seconds

    @assertions @visibility
    Scenario: Verify element visibility
        Then I should see "//android.widget.TextView[@text='API Demos']"
        When I tap on "//android.widget.TextView[@text='Views']"
        Then I should see "//android.widget.TextView[@text='Animation']"
        And I should not see "//android.widget.TextView[@text='API Demos']"

    @assertions @existence
    Scenario: Verify element existence
        Then "//android.widget.TextView[@text='API Demos']" should exist
        And "//android.widget.TextView[@text='Views']" should exist
        And "//android.widget.TextView[@text='NonExistent Element']" should not exist

    @assertions @enabled
    Scenario: Verify element enabled state
        When I tap on "//android.widget.TextView[@text='Views']"
        And I tap on "//android.widget.TextView[@text='Buttons']"
        Then "//android.widget.Button[@resource-id='io.appium.android.apis:id/button_normal']" should be enabled

    @assertions @text-exact
    Scenario: Verify exact text content
        Then "//android.widget.TextView[@text='API Demos']" should have exact text "API Demos"

    @assertions @text-contains
    Scenario: Verify text contains substring
        Then "//android.widget.TextView[@text='API Demos']" should contain text "API"
        And "//android.widget.TextView[@text='API Demos']" should contain text "Demos"

    @assertions @count
    Scenario: Count elements on screen
        When I tap on "//android.widget.TextView[@text='Views']"
        Then I should see 1 "//android.widget.TextView[@text='Animation']" elements

    @assertions @selected
    Scenario: Verify element selection state
        When I tap on "//android.widget.TextView[@text='Views']"
        And I tap on "//android.widget.TextView[@text='Controls']"
        And I tap on "//android.widget.TextView[@text='1. Light Theme']"
        When I tap on "//android.widget.CheckBox[@resource-id='io.appium.android.apis:id/check1']"
        Then "//android.widget.CheckBox[@resource-id='io.appium.android.apis:id/check1']" should be selected

    @assertions @value
    Scenario: Verify input field value
        When I tap on "//android.widget.TextView[@text='Views']"
        And I tap on "//android.widget.TextView[@text='Auto Complete']"
        And I tap on "//android.widget.TextView[@text='1. Screen Top']"
        When I enter "Test Value" into "//android.widget.AutoCompleteTextView[@resource-id='io.appium.android.apis:id/edit']"
        Then "//android.widget.AutoCompleteTextView[@resource-id='io.appium.android.apis:id/edit']" value should be "Test Value"

    @assertions @wait-displayed
    Scenario: Wait until element is displayed
        Then I wait until "//android.widget.TextView[@text='API Demos']" is displayed
        When I tap on "//android.widget.TextView[@text='Views']"
        Then I wait until "//android.widget.TextView[@text='Animation']" is displayed

    @assertions @wait-not-displayed
    Scenario: Wait until element is not displayed
        When I tap on "//android.widget.TextView[@text='Views']"
        Then I wait until "//android.widget.TextView[@text='API Demos']" is not displayed

    @assertions @multiple
    Scenario: Multiple assertions on same screen
        Then "//android.widget.TextView[@text='API Demos']" should exist
        And "//android.widget.TextView[@text='API Demos']" should be enabled
        And "//android.widget.TextView[@text='API Demos']" should have exact text "API Demos"
        And I should see "//android.widget.TextView[@text='Views']"
        And "//android.widget.TextView[@text='Views']" should exist