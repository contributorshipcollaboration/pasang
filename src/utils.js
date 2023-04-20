// Collection of util functions for the extension
/* async function getCurrentTab() {
    let queryOptions = { active: true, currentWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
  } */

// Convert spreadsheet format to belayer schema
export function spreadsheetToSchema(info) {
  // Creating named objects from each row
  const mappedInfo = info.slice(1).map(element => {
    let obj = {}
    element.forEach((value, index) => {
      obj[info[0][index]] = value
    });
    return obj
  });
  // Exclude empty rows
  const filteredInfo = mappedInfo.filter(o => o.Firstname != "")
  // Constructing schema
  // Authors
  let Author = []
  filteredInfo.forEach((e, index) => {
    let obj = {
      "author-id": index,
      "firstname": e.Firstname,
      "middlename": e["Middle name"],
      "surname": e.Surname,
      "email": e["Email address"],
      "attributes": {
        "is-corresponding-author": (e["Corresponding author?"] === "TRUE" ? true : false),
        "byline-position": e["Order in publication"]
      }
    }
    Author.push(obj)
  })
  // Roles
  // TODO: Code is spagetthi, make it tidy
  let Role = []
  // Array of CRediT roles
  const creditRoles = ["Conceptualization", "Data curation", "Formal analysis", "Funding acquisition", "Investigation", "Methodology", "Project administration", "Resources", "Software", "Supervision", "Validation", "Visualization", "Writing - original draft", "Writing - review & editing"]
  // Select CRediT roles that were chosen and keep distinct roles only
  let chosenRoles = filteredInfo.map(o => {
    const temp = Object.keys(o).filter((key) => creditRoles.includes(key)).
      reduce((obj, key) => {
        return Object.assign(obj, {
          [key]: o[key]
        });
      }, {})
    return Object.fromEntries(Object.entries(temp).filter(([key, value]) => value === 'TRUE'))
  })
  chosenRoles = chosenRoles.map(o => Object.keys(o)).flat(1)
  chosenRoles = [...new Set(chosenRoles)]
  chosenRoles.forEach((e, index) => {
    let obj = {
      "role-id": index,
      "name": e
    }
    Role.push(obj)
  })
  // Affiliation
  // Since affiliations are not collected as the journal submission systems require them to be
  // there are two versions of contributors table now (one is more detailed)
  // The app should work with the more detailed version and skip the affiliation with a notice
  // message if the less detailed is used
  let Affiliation = []
  filteredInfo.forEach((e, index) => {
    let obj = {
      "institution-id": index,
      "name": "",
      "city": "",
      "country": "",
      "department": ""
    }
    Affiliation.push(obj)
  })
}
