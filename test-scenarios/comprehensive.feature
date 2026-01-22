Feature: Comprehensive Appium Cucumber Steps Test Suite

    Background:
        Given I launch the app
        When I wait for 2 seconds

    @smoke @navigation
    Scenario: Verify app launches successfully
        Then I should see "//android.widget.TextView[@text='API Demos']"
        And "//android.widget.TextView[@text='API Demos']" should exist
        And "//android.widget.TextView[@text='API Demos']" should be enabled

    @navigation @back
    Scenario: Navigate forward and back
        When I tap on "//android.widget.TextView[@text='Views']"
        Then I should see "//android.widget.TextView[@text='Animation']"
        When I navigate back
        Then I should see "//android.widget.TextView[@text='API Demos']"

    @interaction @tap
    Scenario: Test tap interaction
        When I tap on "//android.widget.TextView[@text='Views']"
        Then I should see "//android.widget.TextView[@text='Animation']"
        When I tap on "//android.widget.TextView[@text='Animation']"
        Then I should see "//android.widget.TextView[@text='3D Transition']"

    @interaction @text-input
    Scenario: Test text input functionality
        When I tap on "//android.widget.TextView[@text='Views']"
        And I tap on "//android.widget.TextView[@text='Auto Complete']"
        And I tap on "//android.widget.TextView[@text='1. Screen Top']"
        When I enter "United States" into "//android.widget.AutoCompleteTextView[@resource-id='io.appium.android.apis:id/edit']"
        Then "//android.widget.AutoCompleteTextView[@resource-id='io.appium.android.apis:id/edit']" should contain text "United States"

    @interaction @clear-text
    Scenario: Test clearing text fields
        When I tap on "//android.widget.TextView[@text='Views']"
        And I tap on "//android.widget.TextView[@text='Auto Complete']"
        And I tap on "//android.widget.TextView[@text='1. Screen Top']"
        When I enter "Test Input" into "//android.widget.AutoCompleteTextView[@resource-id='io.appium.android.apis:id/edit']"
        Then "//android.widget.AutoCompleteTextView[@resource-id='io.appium.android.apis:id/edit']" should contain text "Test Input"
        When I clear "//android.widget.AutoCompleteTextView[@resource-id='io.appium.android.apis:id/edit']"
        And I wait for 1 seconds
        Then "//android.widget.AutoCompleteTextView[@resource-id='io.appium.android.apis:id/edit']" value should be ""

    @interaction @append-text
    Scenario: Test appending text
        When I tap on "//android.widget.TextView[@text='Views']"
        And I tap on "//android.widget.TextView[@text='Auto Complete']"
        And I tap on "//android.widget.TextView[@text='1. Screen Top']"
        When I enter "Hello" into "//android.widget.AutoCompleteTextView[@resource-id='io.appium.android.apis:id/edit']"
        And I append " World" to "//android.widget.AutoCompleteTextView[@resource-id='io.appium.android.apis:id/edit']"
        Then "//android.widget.AutoCompleteTextView[@resource-id='io.appium.android.apis:id/edit']" should contain text "Hello World"

    @interaction @scroll
    Scenario: Test scrolling to element
        When I tap on "//android.widget.TextView[@text='Views']"
        And I scroll to "//android.widget.TextView[@text='WebView']"
        Then I should see "//android.widget.TextView[@text='WebView']"

    @assertions @visibility
    Scenario: Test element visibility assertions
        Then I should see "//android.widget.TextView[@text='API Demos']"
        When I tap on "//android.widget.TextView[@text='Views']"
        Then I should not see "//android.widget.TextView[@text='API Demos']"

    @assertions @existence
    Scenario: Test element existence
        Then "//android.widget.TextView[@text='API Demos']" should exist
        And "//android.widget.TextView[@text='NonExistent']" should not exist

    @assertions @enabled-disabled
    Scenario: Test enabled state
        When I tap on "//android.widget.TextView[@text='Views']"
        And I tap on "//android.widget.TextView[@text='Buttons']"
        Then "//android.widget.Button[@resource-id='io.appium.android.apis:id/button_normal']" should be enabled

    @assertions @text-validation
    Scenario: Test text content assertions
        Then "//android.widget.TextView[@text='API Demos']" should have exact text "API Demos"
        And "//android.widget.TextView[@text='API Demos']" should contain text "API"

    @assertions @count
    Scenario: Test element count
        When I tap on "//android.widget.TextView[@text='Views']"
        Then I should see 1 "//android.widget.TextView[@text='Animation']" elements

    @wait @explicit-wait
    Scenario: Test explicit wait
        When I wait for 3 seconds
        Then I should see "//android.widget.TextView[@text='API Demos']"

    @wait @wait-until-displayed
    Scenario: Test wait until element is displayed
        Then I wait until "//android.widget.TextView[@text='API Demos']" is displayed
        When I tap on "//android.widget.TextView[@text='Views']"
        Then I wait until "//android.widget.TextView[@text='Animation']" is displayed

    @wait @wait-until-not-displayed
    Scenario: Test wait until element disappears
        When I tap on "//android.widget.TextView[@text='Views']"
        Then I wait until "//android.widget.TextView[@text='API Demos']" is not displayed

    @interaction @checkbox
    Scenario: Test checkbox interaction
        When I tap on "//android.widget.TextView[@text='Views']"
        And I tap on "//android.widget.TextView[@text='Controls']"
        And I tap on "//android.widget.TextView[@text='1. Light Theme']"
        When I tap on "//android.widget.CheckBox[@resource-id='io.appium.android.apis:id/check1']"
        Then "//android.widget.CheckBox[@resource-id='io.appium.android.apis:id/check1']" should be selected

    @interaction @radio-button
    Scenario: Test radio button selection
        When I tap on "//android.widget.TextView[@text='Views']"
        And I tap on "//android.widget.TextView[@text='Controls']"
        And I tap on "//android.widget.TextView[@text='1. Light Theme']"
        When I tap on "//android.widget.RadioButton[@resource-id='io.appium.android.apis:id/radio1']"
        Then "//android.widget.RadioButton[@resource-id='io.appium.android.apis:id/radio1']" should be selected

    @navigation @deep-navigation
    Scenario: Deep navigation through multiple screens
        When I tap on "//android.widget.TextView[@text='Views']"
        And I tap on "//android.widget.TextView[@text='Animation']"
        And I tap on "//android.widget.TextView[@text='3D Transition']"
        Then I should see "//android.widget.Button[@resource-id='io.appium.android.apis:id/button']"
        When I navigate back
        Then I should see "//android.widget.TextView[@text='3D Transition']"
        When I navigate back
        Then I should see "//android.widget.TextView[@text='Animation']"
        When I navigate back
        Then I should see "//android.widget.TextView[@text='API Demos']"

    @interaction @list-navigation
    Scenario: Navigate through list items
        When I tap on "//android.widget.TextView[@text='Views']"
        Then I should see "//android.widget.TextView[@text='Animation']"
        And I should see "//android.widget.TextView[@text='Auto Complete']"
        And I should see "//android.widget.TextView[@text='Buttons']"

    @assertions @multiple-elements
    Scenario: Verify multiple elements on screen
        When I tap on "//android.widget.TextView[@text='Views']"
        Then "//android.widget.TextView[@text='Animation']" should exist
        And "//android.widget.TextView[@text='Auto Complete']" should exist
        And "//android.widget.TextView[@text='Buttons']" should exist
        And "//android.widget.TextView[@text='Controls']" should exist

    @interaction @toggle
    Scenario: Test toggle button
        When I tap on "//android.widget.TextView[@text='Views']"
        And I tap on "//android.widget.TextView[@text='Buttons']"
        When I tap on "//android.widget.ToggleButton[@resource-id='io.appium.android.apis:id/button_toggle']"
        Then "//android.widget.ToggleButton[@resource-id='io.appium.android.apis:id/button_toggle']" should be selected