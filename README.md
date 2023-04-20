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