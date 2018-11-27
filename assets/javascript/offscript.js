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

        // On click function for use to submit their recipe request based on the ingredients in their fridge.
        $(document).on("click", "#find-recipes", function (event) {
                // prevent the page from refreshing
                event.preventDefault();
                // storing the user input in whatsInTheFridge variable so that it can be concatenated into the spoonacular search endpoint URL
                let whatsInTheFridge = $("#ingredient-input").val().trim();
                console.log(whatsInTheFridge);

                // creating a vairable to store the relevant URL for the user search
                let whatsInTheFridgeURL = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/findByIngredients?fillIngredients=false&ingredients=" + whatsInTheFridge + "&limitLicense=false&number=5&ranking=1";

                //  variable that holds a reference to the <div> id = "dinner-table"
                let dinnerTable = $("dinner-table");

                // ajax call to search for recipes based on user input from the what's in the fridge form
                $.ajax({
                        beforeSend: function (request) {
                                request.setRequestHeader("X-Mashape-Key", "Opn7fgzDzImshjKftqensUuVw0XIp1SkMBQjsnfyMPrMiQydkc");
                        },
                        dataType: "Json",
                        method: "GET",
                        url: whatsInTheFridgeURL

                        // once the data has been returned run the code below
                }).then(function (response) {

                        // variable holding the ajax data object for the recipe search
                        let results = response;
                        console.log(results);
                        let SITE_BASE = "https://spoonacular.com/recipes/";

                        // Clear previous search results
                        let recipeDiv = $("#dinner-table");
                        recipeDiv.empty();

                        for (var i = 0; i < results.length; i++) {
                                let recipeTitle = results[i].title;
                                let recipeID = results[i].id;

                                let recipeLink = $("<a>");

                                //FIXME:we don't need this anymore it was annoying for me when I was testing the on click event because it kept taking me to another page and then I had to navigate back to see if the event was triggered.  Now it does, yayeah! 
                                // recipeLink.attr({
                                //     href: SITE_BASE + recipeTitle + "-" + recipeID,
                                //     target: "_blank",
                                // })

                                let titleText = $("<h4>").text(recipeTitle);

                                let recipeImage = $("<img>");
                                recipeImage.attr({
                                        class: "img-fluid img-thumbnail shadow rounded",
                                        src: results[i].image,
                                        value: recipeID,
                                })

                                recipeDiv.append(recipeLink)
                                recipeLink.append(titleText);
                                recipeLink.append(recipeImage);
                        }
                });
        });

        // When the user clicks on a specific recipe (."shadow"), run the code below
        $(document).on("click", ".shadow", function (event) {

                // storing the user input in whatsInTheFridge variable so that it can be concatenated into the spoonacular search endpoint URL
                let whatsInTheFridge = $("#ingredient-input").val().trim();
                console.log(whatsInTheFridge);

                // TODO: still working on returning wine pairing information but there is an object in the console
                let winePairingURL = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/food/wine/pairing?food=" + whatsInTheFridge + "&maxPrice=15";

                // Clear value of search input 
                // FIXME: Nate moved this so that he could use the whatsInTheFridge variable again for the second on click event so that he could get the wine pairing returned based on the user food input 
                // $("#ingredient-input").val("");

                // ajax call for wine pairing info
                $.ajax({
                        beforeSend: function (request) {
                                request.setRequestHeader("X-Mashape-Key", "Opn7fgzDzImshjKftqensUuVw0XIp1SkMBQjsnfyMPrMiQydkc");
                        },

                        dataType: "Json",
                        method: "GET",
                        url: winePairingURL

                        // Once the promise is returned run the code below
                }).then(function (response) {

                        // variable holding the ajax data object for the wine pairing
                        let results = response;
                        console.log(results);

                        let winePairing = $("<div>").text(results.pairingText);
                        $("#wine-pairing").append(winePairing);


                });

                // find the value attribute of $(this) recipeImage and hold it in the uniqueRecipeId variable so that it can be dynamically inserted into the queryURL of the  unique recipe information api call.  
                let uniqueRecipeId = $(this).attr("value");

                // query Url variable for unique recipe api call
                let uniqueRecipeURL = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/" + uniqueRecipeId + "/information";

                // ajax call for unique recipe info
                $.ajax({
                        beforeSend: function (request) {
                                request.setRequestHeader("X-Mashape-Key", "Opn7fgzDzImshjKftqensUuVw0XIp1SkMBQjsnfyMPrMiQydkc");
                        },

                        dataType: "Json",
                        method: "GET",
                        url: uniqueRecipeURL

                        // Once the promise is returned run the code below
                }).then(function (response) {

                        // variable holding the ajax data object for the cooking instructions
                        let results = response;
                        console.log(results);

                        // hide the <div> with id = "food"
                        $("#food").hide()

                        // dynamically creating a new div with the recipe instructions inside of it
                        let recipeInstructions = $("<div>").text(results.instructions);

                        // dynamically creating a back button so that the user can get back to the recipes once they are reading instructions
                        let backButton = $("<button>").attr("id", "back-button").addClass("button").text("BACK-BUTTON");

                        // appending the recipeInstructions <div> to the <div> with id = "instrucitons"
                        $("#instructions").append(recipeInstructions);

                        // appending the recipeInstructions <div> to the <div> with id = "instrucitons"
                        $("#instructions").append(backButton);

                        // This on click event listener takes the user back to the recipes page after they are done looking at the cooking instructions 
                        $(document).on("click", "#back-button", function (event) {
                                
                                console.log("button click")
                                
                                // hides the recipe instructions
                                $("#instructions").hide();
                                
                                // show the div with id = "food" 
                                $("#food").show();

                        });

                });

        });

});
