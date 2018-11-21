$(document).ready(function () {

    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyAQ53ca_s_uXVyKNZrRFTYSIfbgJhJKAZQ",
        authDomain: "cheap-date-fc5c4.firebaseapp.com",
        databaseURL: "https://cheap-date-fc5c4.firebaseio.com",
        projectId: "cheap-date-fc5c4",
        storageBucket: "cheap-date-fc5c4.appspot.com",
        messagingSenderId: "196759091475"
    };
    firebase.initializeApp(config);

    // creating a vairable to store the relevant URL for the user search
    let queryURL = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/findByIngredients?fillIngredients=false&ingredients=apples%2Cflour%2Csugar&limitLicense=false&number=5&ranking=1"

    $.ajax({
        /*Need to figure out how to configure a header in ajax and where the x-mashape-key is but it should look something like this (see next comment) according to the docs here: https://market.mashape.com/spoonacular/recipe-food-nutrition#search-recipes-by-ingredients*/

        /* HttpResponse<JsonNode> response = Unirest.get("https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/search?diet=vegetarian&excludeIngredients=coconut&instructionsRequired=false&intolerances=egg%2C+gluten&limitLicense=false&number=10&offset=0&query=burger&type=main+course")
        .header("X-Mashape-Key", "pTIzYRM18Gmshga0jX6egqHPjrYrp16Qqs8jsn2EtG8iROF0Kt")
        .header("Accept", "application/json")
        .asJson();*/

        url: queryURL,
        method: "GET"
    }).then(function (response) {

        let results = response.data;
        console.log(results);
    });
});