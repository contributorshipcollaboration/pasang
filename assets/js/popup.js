// get submit button
const submit = document.getElementById("submit");

//  inject values from contributors table to form
function fillForm(contributors_info) {
    // Choose appropriate recipe based on the journal
    nhb_recipe(contributors_info)
}

// define injection async function
async function injectScript() {
    // get contributors info
    const contributors_info = JSON.parse(document.getElementById("contributor_information").value)
    console.log(contributors_info)

    // get current tab id
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    // run inject functionon current tab
    await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: fillForm,
    args: [contributors_info]
    });

    // close popup window
    window.close();
}

// add injection function to submit button
submit.addEventListener( 'click', injectScript);