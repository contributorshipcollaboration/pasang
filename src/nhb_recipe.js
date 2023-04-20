// TODO: Delete the getCurrentTab function after I figured out how to source this from assets/js/utils.js
async function getCurrentTab() {
    let queryOptions = { active: true, currentWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
  }

// Function to populate Nature Human Behaviour submission portal
export async function nhb_recipe(contributors_info) {
    // get current tab id
    let tab = await getCurrentTab();

    function set_n_contrib(contributors_info) {
        // Get the number of contributors
        const n_contributors = contributors_info["Author"].length
        // Set the number of contributors
        document.getElementById("num_authors").value = n_contributors
        // Submit the number of contributors
        document.getElementById("num_auth_button").click()
        // 
        chrome.storage.local.set({ task: "start autofill" })
    }
   
    // Run inject function on current tab
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: set_n_contrib,
        args: [contributors_info]
    });

    //
    function fill_form(contributors_info) {
        // Get the number of contributors
        const n_contributors = contributors_info["Author"].length

        // Iteratively fill out each authors information
        for (let i = 0; i < n_contributors; i++) {
            // Select the author info
            let author = contributors_info["Author"][i]

            // With NHB the corresponding author elements have different id
            //Check if the authors is the corresponding author
            if (author.attributes !== undefined && author.attributes["is-corresponding-author"] !== undefined) {
                var is_corresponding = author.attributes["is-corresponding-author"]
            } else {
                var is_corresponding = false
            }
            
            // Identify element id prefixes programatically
            if (is_corresponding) {
                var prefix = "corr_auth"
            } else {
                var prefix = `contrib_auth_${i}`
            }

            // The author information DIV has to made editable by a toggle href
            // First check if the given div is open
            let author_info_div = document.getElementById(`open_${prefix}_`)
              if (author_info_div.style.display == "none") {
                // If closed open it
                // Divs will be populated even if they are closed
                let closed_div = document.getElementById(`closed_${prefix}_`)
                closed_div.getElementsByTagName("a")[0].click()
            }

            // Populate author fields
            // Author order
            document.getElementById(`${prefix}_author_seq`).value = i + 1
            // Title
            // Currently we do no colllect this information: defaults to Dr
            document.getElementById(`${prefix}_title`).value = "Dr"
            // First name
            document.getElementById(`${prefix}_first_nm`).value = author.firstname
            // Middle name
            document.getElementById(`${prefix}_middle_nm`).value = author.middlename === undefined & author.middlename === "" ? "" : author.middlename
            // Surname
            document.getElementById(`${prefix}_last_nm`).value = author.surname
            // Secondary email
            // Currently we only allow one email address by author so this will be left empty
            document.getElementById(`${prefix}_secondary_email`).value = ""
            // Professional title
            // Company/institution
            // Get the primary institution of the given author
            let institution_id = author.affiliation[0]
            let institution = contributors_info["Affiliation"].find(o => o["institution-id"] === institution_id)
            document.getElementById(`${prefix}_org`).value = institution.name
            // Department
            document.getElementById(`${prefix}_dept`).value = institution.department
            // Adress 1
            // Currently not collected so we leave it empty
            document.getElementById(`${prefix}_addr1`).value = ""
            // Adress 2
            // Currently not collected so we leave it empty
            document.getElementById(`${prefix}_addr2`).value = ""
            // City
            document.getElementById(`${prefix}_city`).value = institution.city
            // State/Province
            // Currently not collected so we leave it empty
            document.getElementById(`${prefix}_state`).value = ""
            // Country/region
            //document.getElementById(`${prefix}_country`).value = institution.country
            // zip
            document.getElementById(`${prefix}_zip`).value = "postal-code" in institution ? institution["postal-code"] : ""
            // Contributions
            // NHB does not use CRediT but they have their own roles
            // By default we will match their roles to CRediT roles
            // TODO: Add form to popup where users can modify which role corresponds in the contributors_info to which NHB role
            // Lookup the CRediT roles of the author
            let role_names = author.role.map(id => contributors_info["Role"].filter(o => o["role-id"] === id).map(o => o.name)[0])
            // TODO: I am sure there is a cleaner way to do this I will rewrite it later

            // Conceived and designed the experiments
            if (role_names.some(s => ["Conceptualization", "Methodology"].includes(s))) {
                document.getElementById(`${prefix}_Conceived_and_designed_the_experiments_CBOX`).checked = true
            }
            // Performed the experiments
            if (role_names.includes("Investigation")) {
                document.getElementById(`${prefix}_Performed_the_experiments_CBOX`).checked = true
            }
            // Analyzed the data
            if (role_names.some(s => ["Data curation", "Formal Analysis"].includes(s))) {
                document.getElementById(`${prefix}_Analyzed_the_data_CBOX`).checked = true
            }
            // Contributed materials/analysis tools
            if (role_names.some(s => ["Resources", "Software"].includes(s))) {
                document.getElementById(`${prefix}_Contributed_materials/analysis_tools_CBOX`).checked = true
            }
            // Wrote the paper
            if (role_names.some(s => ["Writing – original draft", "Writing – review & editing"].includes(s))) {
                document.getElementById(`${prefix}_Wrote_the_paper_CBOX`).checked
            }
            // We do not collect personal keywords (whatever that is)
        }
    }

    chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
        // Only fire when the load is complete
        if (changeInfo.status === "complete") {
            // Check if the number of author boxes are updated
            // If yes, run autofill function
            chrome.storage.local.get(["task"]).then((result) => {
                if (result.task === "start autofill") {
                    chrome.scripting.executeScript({
                        target: { tabId: tab.id },
                        func: fill_form,
                        args: [contributors_info]
                    });
                }
            });
        }
    })
}