/* import nhb_recipe from "./assets/js/recipes/nhb_recipe.js" */

// get submit button
const submit = document.getElementById("submit");

// define injection async function
function injectScript() {
    // get contributors info
    const contributors_info = JSON.parse(document.getElementById("contributor_information").value)
    console.log(contributors_info)

    // call journal recipe function
    nhb_recipe(contributors_info)

    // close popup window
    window.close();
}

// add injection function to submit button
submit.addEventListener( 'click', injectScript);