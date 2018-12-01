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

    let database = firebase.database();

    //MovieDB API Ajax calls
    let api_key = "81e30798ba964b88d42fd6064efd7734"

    // On click function for use to submit their recipe request based on the ingredients in their fridge.
    $(document).on("click", "#find-recipes", function (event) {

        // prevent the page from refreshing
        event.preventDefault();

        // Hide the back-button
        $("#back-button").hide();

        // Erasing the text inside the wine-pairing div
        $("#wine-pairing").text("");

        // Erasing the text inside the instructions div
        $("#instructions").text("");

        // show the div with id = "food" 
        $("#food").show();

        // storing the user input in whatsInTheFridge variable so that it can be concatenated into the spoonacular search endpoint URL
        let whatsInTheFridge = $("#ingredient-input").val().trim();
        console.log(whatsInTheFridge);

        // pushes/saves user input data (ingredients entered) to Firebase
        database.ref().push({
            whatsInTheFridge: whatsInTheFridge
        });

        //On button click, clears/resets user input form
        $("#ingredient-input").trigger("reset");

        // creating a vairable to store the relevant URL for the user search
        let whatsInTheFridgeURL = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/findByIngredients?fillIngredients=false&ingredients=" + whatsInTheFridge + "&limitLicense=false&number=5&ranking=1";

        //  variable that holds a reference to the <div> id = "dinner-table"
        let dinnerTable = $("dinner-table");

        // ajax call to search for recipes based on user input from the what's in the fridge form
        $.ajax({
            beforeSend: function (request) {
                request.setRequestHeader("X-Mashape-Key", "Opn7fgzDzImshjKftqensUuVw0XIp1SkMBQjsnfyMPrMiQydkc");
            },
            
            // headers: {
            //     // 'Access-Control-Allow-Origin': '*',
            //     // 'X-Mashape-Key': "Opn7fgzDzImshjKftqensUuVw0XIp1SkMBQjsnfyMPrMiQydkc",
            //     // 'X-Mashape-Key': "ZpzURN2g7zmshx6acoveSs7Ys9cMp1oAziAjsn6nUbzwubliTh"
            // },
            
            dataType: "Json",
            method: "GET",
            url: whatsInTheFridgeURL,


            // once the data has been returned run the code below
        }).then(function (response) {

            // variable holding the ajax data object for the recipe search
            let results = response;
            console.log(results);

            // Variable for the recipe response
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


    // firebase event listener for child added
    database.ref().on("child_added", function (childSnapshot) {

        // variable set up to access data from firebase
        let newWhatsInTheFridge = childSnapshot.val().whatsInTheFridge;
        // console.log(newWhatsInTheFridge);

        // variable to reference firebase key (id) for each data entry
        let key = childSnapshot.key
        // console.log(key);
    });



    // When the user clicks on a specific recipe (."shadow"), run the code below
    $(document).on("click", ".shadow", function (event) {

        // resetting the values so that it only shows for most recently clicked recipe FIXME: I Don't think we need these
        // $("#wine-pairing").val("");
        // $("#instructions").val("");

        // prevent the page from refreshing
        event.preventDefault();

        // find the value attribute of $(this) recipeImage and hold it in the uniqueRecipeId variable so that it can be dynamically inserted into the queryURL of the  unique recipe information api call.  
        let uniqueRecipeId = $(this).attr("value");

        // query Url variable for unique recipe api call 
        let uniqueRecipeURL = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/" + uniqueRecipeId + "/information";

        // ajax call for unique recipe info
        $.ajax({
            beforeSend: function (request) {
                request.setRequestHeader("X-Mashape-Key", "Opn7fgzDzImshjKftqensUuVw0XIp1SkMBQjsnfyMPrMiQydkc");
            },
            
            // header: {
            //     "Access-Control-Allow-Origin": "*"
            // },

            dataType: "Json",
            method: "GET",
            url: uniqueRecipeURL

            // Once the promise is returned run the code below
        }).then(function (response) {

            // variable holding the ajax data object for the cooking instructions
            let results = response;
            console.log(results.instructions);

            let noInstructions = results.instructions;

            // Adding a conditional statement to let the user know if the recipe they selected lacks instructions the user is notified
            if (results.instructions == null || results.instructions.length === 0) {

                let noInstructionsDisplay = $("<p>").text("Sorry, there are no instructions for this recipe.")
                noInstructionsDisplay.addClass("text-danger");
                console.log(noInstructions)

                // FIXME: Not sure why this is not working tried .text(), .html(), and .append()... 
                $("#instructions").append(noInstructionsDisplay);

            // hide the <div> with id = "food"
            $("#food").hide();

            } else {

            // hide the <div> with id = "food"
            $("#food").hide();

            // dynamically creating a new div with the recipe instructions inside of it
            let recipeInstructions = $("<p>").html(results.instructions);

            // appending the recipeInstructions <div> to the <div> with id = "instrucitons"
            $("#instructions").html(recipeInstructions);
            }
            
            // use JQuery to display recipe title above recipeInstructions
            let selectedRecipeTitle = $("<h4>").html(results.title);
            console.log(selectedRecipeTitle);
            $("#selectedRecipeTitle").html(selectedRecipeTitle);

            // variable to access the arrays of "extended ingredients" from API Object
            let recipeIngredients = results.extendedIngredients;
            console.log(recipeIngredients);

            // empty array to store "original" values pulled from each Array of "extended Ingredients"  
            let ingredientArray = [];

            // for loop to run through "extended ingredients" arrays & store "original" values of each into empty "ingredientArray" 
            for (var j = 0; j < recipeIngredients.length; j++) {

                let ingredientsList = recipeIngredients[j].original;
                console.log(ingredientsList);
                ingredientArray.push(recipeIngredients[j].original);
                console.log(ingredientArray);
            };

            let ingredientsDisplay = document.getElementById("test1");

            // for loop to run through ingredients stored in the "ingredientArray" & display results in HTML. 
            // currently data displayed into HTML is not working yet. It console logs fine.  Just need to resolve and get it to display into HTML
            for (var k = 0; k < ingredientArray.length; k++) {
                console.log(ingredientArray);

                test1.innerHTML += "<p>" + ingredientArray[k] + "</p>";
            }
        });

        // Bringing this variable down from the previous on click event to be used again here (scoping issue)
        let whatsInTheFridge = $("#ingredient-input").val().trim();
        console.log(whatsInTheFridge);

        // Since the wine pairing really only wants one word this line of code takes the first word from whatsInTheFridge and stores it in a variable to be used for the wine pairing ajax call.  I actually do not know exactly how this is working and could use some explanation of the .replace method.
        // https://stackoverflow.com/questions/18558417/get-first-word-of-string
        let firstIngredient = whatsInTheFridge.replace(/,.*/, '');
        console.log(firstIngredient);

        // set the wine pairing API URL to the winePairingURL variable and use the first ingredient from whatsInTheFridge for the food input of the winePairingURL so that the user is more likely to get a pairing suggestion than if we use the entire string
        let winePairingURL = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/food/wine/pairing?food=" + firstIngredient + "&maxPrice=15";

        // Clear value of search input 
        // FIXME: Nate moved this so that he could use the whatsInTheFridge variable again for the second on click event so that he could get the wine pairing returned based on the user food input 
        // $("#ingredient-input").val("");

        // ajax call for wine pairing info
        $.ajax({
            beforeSend: function (request) {
                request.setRequestHeader("X-Mashape-Key", "Opn7fgzDzImshjKftqensUuVw0XIp1SkMBQjsnfyMPrMiQydkc");
            },

            // header: {
            //     'Access-Control-Allow-Origin': '*'
            // },

            dataType: "Json",
            method: "GET",
            url: winePairingURL


            // Once the promise is returned run the code below
        }).then(function (response) {

            // variable holding the ajax data object for the wine pairing
            let results = response;
            console.log(results);

            //If AJAX call returns failure or empty array or 0 array data do this

            let errorArray = {
                title: "Mad Dog 20/20",
                flavors: ["Banana Red", "Dragon Fruit", "Electric Melon", "Red Grape Wine", "Habanero Lime Arita", "Orange Jubilee", "Peaches & Cream", "Strawberry Kiwi"]

            }

            function failureMessage() {

                $("#wine-pairing").html("");


                let randomFlavor = Math.floor(Math.random() * errorArray.flavors["length"]);

                //TODO: Under construction...will push title/flavor/image to wine pairing div upon failure, if I can get it working here it will also go in the else if statement.  Then work refactoring to reduce repeate elements (Neri)//
                let errorImage = $("<img>");
                errorImage.attr({
                    class: "img-fluid img-thumbnail rounded shadow",
                    src: "assets/images/error-images/image" + randomFlavor + ".jpg",
                })

                let errorDescription = $("<h4>").html(errorArray.title);
                let errorFlavor = $("<h4>").html(errorArray.flavors[randomFlavor]);

                $("#wine-pairing").append(errorDescription);
                $("#wine-pairing").append(errorImage);
                $("#wine-pairing").append(errorFlavor);

            }

            if (results.status === "failure") {
                failureMessage();

            } else if (results.pairedWines == null || results.pairedWines.length === 0) {
                failureMessage();

            } else {

                // creating divs to hold the specific wine data suggested from spoonacular
                let pairingNotes = $("<p>").html(results.pairingText);

                // create a html element to hold the name of a specifically suggested wine
                let specificWineSuggestion = $("<p>").html(results.productMatches[0].title);

                // create a html element to hold that specific wine's description
                let specificWineDescription = $("<p>").html(results.productMatches[0].description);

                // appending those results to the div with id="wine-pairing"
                $("#wine-pairing").append(pairingNotes);
                $("#wine-pairing").append(specificWineSuggestion);
                $("#wine-pairing").append(specificWineDescription);

            }

        });

        // dynamically creating a back button so that the user can get back to the recipes once they are reading instructions
        let backButton = $("<button>").attr("id", "back-button").addClass("button").text("BACK TO RECIPES");

        // appending the recipeInstructions <div> to the <div> with id = "instrucitons"
        $("#button2").html(backButton);

        // This on click event listener takes the user back to the recipes page after they are done looking at the cooking instructions 
        $(document).on("click", "#back-button", function (event) {

            // prevent the page from refreshing
            event.preventDefault();

            // Hide the back-button
            $("#back-button").hide();

            // Erasing the text inside the wine-pairing div
            $("#wine-pairing").text("");

            // Erasing the text inside the instructions div
            $("#instructions").text("");

            $("#test1").text("");

            $("#selectedRecipeTitle").text("");

            // show the div with id = "food" 
            $("#food").show();

        });

    });


    $("#movieGenres").change(function () {
        let IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w185_and_h278_bestv2"

        // The "value" attribute of the selected option is the genre id that
        // will be used in the ajax call
        let movieGenre = $("#movieGenres").val().trim();
        console.log(movieGenre);

        //Ajax call for Movies based on popularity for selected genre
        $.ajax({
            url: "https://api.themoviedb.org/3/discover/movie?api_key=" + api_key + "&with_genres=" + movieGenre + "&language=en-US&certification_country=US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1"
        }).then(function (response) {
            console.log(response);

            // Storing an array of results in the results variable
            let movieResults = response.results;

            let movieResultsTable = $("#movieTable");
            movieResultsTable.empty();

            // Looping over every result item
            for (var i = 0; i < movieResults.length; i++) {

                let movie = movieResults[i];

                console.log(movie.title);

                let movieDiv = $("<div>");

                movieDiv.attr({
                    // Set a class on the div that can be used to hook up events
                    class: "movie-item",
                    "data-movie-id": movie.id,
                    "data-movie-release-date": movie.release_date
                });

                let movieTitle = $("<h4>");
                movieTitle.text(movie.title);

                movieDiv.append(movieTitle);



                let movieImg = $("<img>");
                movieImg.attr({
                    // Can't use shadow class here because it is used elsewhere for an event
                    class: "img-fluid img-thumbnail rounded",
                    src: IMAGE_BASE_URL + movie.poster_path,
                    value: movie.id
                });


                movieDiv.append(movieImg);

                let overviewDiv = $("<div>");
                overviewDiv.attr("class", "movie-overview")
                overviewDiv.text(movie.overview);
                overviewDiv.hide();
                movieDiv.append(overviewDiv);

                movieResultsTable.append(movieDiv);


            }
        });

      
    });

      // When you click on a movie (".movie-item")
      $(document).on("click", ".movie-item", function () {
        console.log("clicked");
        let movieId = $(this).attr("data-movie-id");
        let movieReleaseDate = $(this).attr("data-movie-release-date");
        console.log("Movie id: " + movieId);
        console.log("Movie Release date: " + movieReleaseDate);
        console.log($(this).children(".movie-overview"))
        $(this).children(".movie-overview").toggle();
        console.log("did toggle");
        let movieUrl = "https://api.themoviedb.org/3/movie/" + movieId + "?api_key=" + api_key;
        console.log(movieUrl);
        // FIXME: Do something more interesting
    })

});


