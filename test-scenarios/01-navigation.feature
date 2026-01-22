Feature: Navigation Tests

    Background:
        Given I launch the app
        And I wait for 2 seconds

    @navigation @launch
    Scenario: App launches successfully
        Then I should see "//android.widget.TextView[@text='API Demos']"

    @navigation @forward-back
    Scenario: Navigate forward and backward
        When I tap on "//android.widget.TextView[@text='Views']"
        Then I should see "//android.widget.TextView[@text='Animation']"
        When I navigate back
        Then I should see "//android.widget.TextView[@text='API Demos']"

    @navigation @multi-level
    Scenario: Multi-level navigation
        When I tap on "//android.widget.TextView[@text='Views']"
        And I tap on "//android.widget.TextView[@text='Animation']"
        And I tap on "//android.widget.TextView[@text='3D Transition']"
        Then I should see "//android.widget.Button[@resource-id='io.appium.android.apis:id/button']"
        When I navigate back
        And I navigate back
        And I navigate back
        Then I should see "//android.widget.TextView[@text='API Demos']"

    @navigation @wait
    Scenario: Test wait functionality
        When I wait for 1 seconds
        Then I should see "//android.widget.TextView[@text='API Demos']"
        When I wait for 2 seconds
        Then I should see "//android.widget.TextView[@text='Views']"