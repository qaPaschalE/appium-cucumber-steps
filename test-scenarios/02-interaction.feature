Feature: Element Interaction Tests

    Background:
        Given I launch the app
        And I wait for 2 seconds

    @interaction @tap
    Scenario: Tap on elements
        When I tap on "//android.widget.TextView[@text='Views']"
        Then I should see "//android.widget.TextView[@text='Animation']"
        When I tap on "//android.widget.TextView[@text='Animation']"
        Then I should see "//android.widget.TextView[@text='3D Transition']"

    @interaction @text-input
    Scenario: Enter text into input field
        When I tap on "//android.widget.TextView[@text='Views']"
        And I tap on "//android.widget.TextView[@text='Auto Complete']"
        And I tap on "//android.widget.TextView[@text='1. Screen Top']"
        When I enter "Canada" into "//android.widget.AutoCompleteTextView[@resource-id='io.appium.android.apis:id/edit']"
        Then "//android.widget.AutoCompleteTextView[@resource-id='io.appium.android.apis:id/edit']" should contain text "Canada"

    @interaction @clear
    Scenario: Clear text from input field
        When I tap on "//android.widget.TextView[@text='Views']"
        And I tap on "//android.widget.TextView[@text='Auto Complete']"
        And I tap on "//android.widget.TextView[@text='1. Screen Top']"
        When I enter "Test Text" into "//android.widget.AutoCompleteTextView[@resource-id='io.appium.android.apis:id/edit']"
        And I clear "//android.widget.AutoCompleteTextView[@resource-id='io.appium.android.apis:id/edit']"
        Then "//android.widget.AutoCompleteTextView[@resource-id='io.appium.android.apis:id/edit']" value should be ""

    @interaction @append
    Scenario: Append text to existing text
        When I tap on "//android.widget.TextView[@text='Views']"
        And I tap on "//android.widget.TextView[@text='Auto Complete']"
        And I tap on "//android.widget.TextView[@text='1. Screen Top']"
        When I enter "First" into "//android.widget.AutoCompleteTextView[@resource-id='io.appium.android.apis:id/edit']"
        And I append " Second" to "//android.widget.AutoCompleteTextView[@resource-id='io.appium.android.apis:id/edit']"
        Then "//android.widget.AutoCompleteTextView[@resource-id='io.appium.android.apis:id/edit']" should contain text "First Second"

    @interaction @checkbox
    Scenario: Toggle checkbox
        When I tap on "//android.widget.TextView[@text='Views']"
        And I tap on "//android.widget.TextView[@text='Controls']"
        And I tap on "//android.widget.TextView[@text='1. Light Theme']"
        When I tap on "//android.widget.CheckBox[@resource-id='io.appium.android.apis:id/check1']"
        Then "//android.widget.CheckBox[@resource-id='io.appium.android.apis:id/check1']" should be selected

    @interaction @radio
    Scenario: Select radio button
        When I tap on "//android.widget.TextView[@text='Views']"
        And I tap on "//android.widget.TextView[@text='Controls']"
        And I tap on "//android.widget.TextView[@text='1. Light Theme']"
        When I tap on "//android.widget.RadioButton[@resource-id='io.appium.android.apis:id/radio2']"
        Then "//android.widget.RadioButton[@resource-id='io.appium.android.apis:id/radio2']" should be selected

    @interaction @button
    Scenario: Tap on buttons
        When I tap on "//android.widget.TextView[@text='Views']"
        And I tap on "//android.widget.TextView[@text='Buttons']"
        When I tap on "//android.widget.Button[@resource-id='io.appium.android.apis:id/button_normal']"
        Then I should see "//android.widget.Button[@resource-id='io.appium.android.apis:id/button_normal']"

    @interaction @toggle
    Scenario: Toggle button state
        When I tap on "//android.widget.TextView[@text='Views']"
        And I tap on "//android.widget.TextView[@text='Buttons']"
        When I tap on "//android.widget.ToggleButton[@resource-id='io.appium.android.apis:id/button_toggle']"
        Then "//android.widget.ToggleButton[@resource-id='io.appium.android.apis:id/button_toggle']" should be selected

    @interaction @scroll
    Scenario: Scroll to element
        When I tap on "//android.widget.TextView[@text='Views']"
        And I scroll to "//android.widget.TextView[@text='WebView']"
        Then I should see "//android.widget.TextView[@text='WebView']"