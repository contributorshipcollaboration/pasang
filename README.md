# pasang
The _pasang_ browser extension helps researchers automatically upload information regarding the authors of a manuscript in bulk on a scientific journal’s submission website (JMS or journal management system). Currently, most JMSes only offer HTML forms to submit this information, making the process cumbersomely manual and error-prone, especially for papers with many authors. The _pasang_ browser extension allows researchers to expedite this process by automatically filling out the forms on the journal’s submission portals with the authors’ information that was collected and curated beforehand by using [tenzing](https://tenzing.club).

# Install


# Usage
_pasang_ uses the contributors' information formatted according the [belayer](https://github.com/tenzing-contrib/belayer) journal article contributor information JSON schema.

Currently the extension is not available from the Chrome Web Store but the development version can be installed locally. To install and run the development version follow these steps:
* Download the `build/` folder from this repository to your computer
* Open `chrome://extensions` in a Chrome web browser
* Check the `Developer mode` checkbox
* Click on the `Load unpacked extension` button
* Select the `build/` folder to add the extension
* Pin it to your search bar to make it easily available

To run _pasang_ in developer mode:
* Clone the project from Github to your computer
* Go to the project folder
* Run `npm run watch` in the terminal
* Open `chrome://extensions`
* Check the Developer mode checkbox
* Click on the `Load unpacked extension` button
* Select the folder `pasang/build/`

# Supported journals
- Nature Human Behaviour

# Contributions

The package was built using the [__Chrome extension CLI__](https://github.com/dutiyesh/chrome-extension-cli#readme) framework.

# Notes for developers
## General notes
* npm packages are not working for some reason. the input schema should be validated (for example with the json-schema or ajv npm packages) using the belayer schema read from github (https://github.com/tenzing-contrib/belayer/blob/main/belayer-flat-schema.json) for the validation. If the validation fail error message should be shown to the user.
* As the npm packages are not working gapi.client.sheets.spreadsheets does not work either. Right now I am using request with the API url, but if we make npm packages work the gapi might be more flexible.
* I left quite a lot comments in my code I hope they help.
* Icons for the project will be changed later.

## About the extension structure
* The info can be provided either formatted according to the belayer json schema (see example here https://github.com/tenzing-contrib/belayer/blob/main/belayer-flat-example.json) or as a tenzing contributor google sheet. The tenzing contributor google sheet has two versions: a simplified (https://docs.google.com/spreadsheets/d/1Gl0cwqN_nTsdFH9yhSvi9NypBfDCEhViGq4A3MnBrG8/edit?usp=sharing) or a more detailed (https://docs.google.com/spreadsheets/d/1ay8pS-ftvfzWTrKCZr6Fa0cTLg3n8KxAOOleZmuE7Hs/edit?usp=sharing). The main difference is that the information in the more detailed one is more granular and lets users define multiple fields that are similar to the belayar schema.
* src/popup.js contains the frontend javascript code for the webextension. This code basically decides which input was read, and calls the src/background.js to do the work. Schema validation if the schema input is used should be done here I think. At the end the popup should be pretty and intuitive. For example, the two input options can be divided by tabs, and table input should be the default open tab. The colorcoding should be similar to tenzing: tenzing.club
* src/background.js calls the autofill function for the forms on the journals' submission site. The autofill functions are stored in the src/ folder as well. Right now, there is only one called nhb_recipe.js for the Nature Human Behavior submission portal. This should be added to a subfolder where we collect other "recipes" for other submission systems.
* The autofill function is working with the schema as an input, but for the contributors google sheets it does not yet. First, the information in the google sheet should be translated to the belayer schema. The function for the translation is the spreadsheetToSchema javascript function in the src/utils.js file. This should be finished. It should work with both versions of the contributor table, however, the affiliations for the less detailed version should be left empty with a notice message.

