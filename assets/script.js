// Global variables===============================================================================================================================================
var apiKey1 = "41490cc9c30ac5171880367eb41b32e3";
var apiKey2 = "c8365256edd594643ad843e3f1e0c7ad";
var cityButtons = [];

// This checks to see if there is data in local storage, and if there is, it pushes it into the cityButtons array
var checkStorage = JSON.parse(localStorage.getItem("cities"));
if (checkStorage) {
    checkStorage.forEach(function(city) {
        cityButtons.push(city);
    });
    localStorage.setItem("cities", JSON.stringify(cityButtons));

    // This runs the getWeather function with the last element in the cityButtons array
    getWeather(cityButtons[cityButtons.length - 1]);
};

// Functions======================================================================================================================================================

// This function creates a button and a delete button for each city inside the cityButtons array
function renderButtons() {

    // Resets the button list so there aren't any repeats
    $("#button-list").empty();
    for (var i = 0; i < cityButtons.length; i++) {

        // Dynamically creates a unique id for each newCityBtn
        var newCityBtn = $("<li class='list-group-item city-button' id='button" + i + "'>");
        newCityBtn.text(cityButtons[i]);

        // Dynamically creates a data-num attribute which is equal to it's corresponding newCityBtn's id
        var deleteBtn = $("<button class='fa fa-backspace btn float-right' data-num='button" + i + "'>");
        newCityBtn.append(deleteBtn);
        $("#button-list").prepend(newCityBtn);
    };
    
    // Puts the cityButtons array into local storage
    localStorage.setItem("cities", JSON.stringify(cityButtons));
};

// A function that converts the date given in the api response into a usable format
function convertDate(timeStamp) {
    return new Date(timeStamp * 1000).toLocaleString("en-US", {
        month: "numeric",
        day: "numeric",
        year: "numeric"
    });
};

// This function makes the ajax call, and uses the response to dynamically create all the elements that get displayed
function getWeather(city) {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + apiKey2;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {
        var name = response.name;
        $("#city-name").text(name + " (" + convertDate(response.dt) + ")");
        $("#current-temp").text(response.main.temp + " °F");
        $("#current-humidity").text(response.main.humidity + "%");
        $("#current-wind").text(response.wind.speed + " MPH");

        // This onecall api url uses the lattitude and longitude from the first api response to make a call of its own
        var oneCallURL = "https://api.openweathermap.org/data/2.5/onecall?units=imperial&lat=" + response.coord.lat + "&lon=" + response.coord.lon + "&appid=" + apiKey1;
        $.ajax({
            url: oneCallURL,
            method: "GET"
        }).then(function(response) {
            var iconURL = "http://openweathermap.org/img/wn/" + response.current.weather[0].icon + "@2x.png";
            $("#current-icon").attr("src", iconURL);
            $("#description").text(response.current.weather[0].description);
            var uvIndex = response.current.uvi;
            $("#uv").text(uvIndex);

            /* This removes any previous class assigned to the uv element and determines the 
               appropriate class to assign based on the uv index of the current city */
            $("#uv").removeClass();
            if (uvIndex < 3) {
                $("#uv").addClass("uv-low");
            } else if (uvIndex > 2 && uvIndex < 6) {
                $("#uv").addClass("uv-moderate");
            } else if (uvIndex > 5 && uvIndex < 8) {
                $("#uv").addClass("uv-high");
            } else if (uvIndex > 7 && uvIndex < 11) {
                $("#uv").addClass("uv-very-high");
            } else {
                $("#uv").addClass("uv-extreme");
            }

            /* This gets rid of any previous forecast cards and loops through the first five days' forecast 
               from the api response and dynamically creates new forecast cards for the current city */
            $("#forecast-cards").empty();
            for (var i = 1; i < 6; i++) {
                var col = $("<div class='col-8 col-sm-4 col-xl-auto'>");
                var card = $("<div class='card forecast mb-2'>");
                var body = $("<div class='card-body forecast'>");
                var cardDate = $("<h4 class='card-title'>");
                cardDate.text(convertDate(response.daily[i].dt));
                var cardIcon = $("<img src='http://openweathermap.org/img/wn/" + response.daily[i].weather[0].icon + "@2x.png' alt='weather icon'>");
                var cardTemp = $("<p class='card-text'>");
                cardTemp.text("Temp: " + response.daily[i].temp.day + " °F");
                var cardHumidity = $("<p class='card-text'>");
                cardHumidity.text("Humidity: " + response.daily[i].humidity + "%");
                body.append(cardDate, cardIcon, cardTemp, cardHumidity);
                card.append(body);
                col.append(card);
                $("#forecast-cards").append(col);
            };
        });

        /* This conditional statement checks if a city is already included in 
           the cityButtons array. If it doesn't exist, it gets pushed in */
        if (!cityButtons.includes(name)) {
            cityButtons.push(name);
        };
        renderButtons();
    });
};

// Event Listeners================================================================================================================================================

// This event listener is attached to the search button and runs the getWeather function on the city typed in
$(".fa-search").on("click", function(event) {
    event.preventDefault();
    if ($("#city-input").val()) {

        // This changes the city name to have plus signs in place of any spaces
        var city = $("#city-input").val().split(" ").join("+");

        // This clears out the text from the input field
        $("#city-input").val("");
        getWeather(city);
    };
});

/* Because the buttons on the button list are created dynamically, we attach the event listener 
   to the parent element and tell it to listen for the li element with the class of city-button */
$("#button-list").on("click", 'li.city-button', function() {
    
    // This will run the getWeather function on whichever city was clicked
    getWeather($(this).text());
});

/* As stated above, because the delete button is created dynamically, we must attach the event listener 
   to its parent element, and then tell it to listen for the button element with the class of fa-backspace */
$("#button-list").on("click", 'button.fa-backspace', function(event) {

    /* Because the element this event listener is attached to is inside of another element with a seperate 
       event listener, we need to add the stopPropagation method so that it doesn't trigger the other event */
    event.stopPropagation();

    /* This will splice the city the user wants to delete out of the cityButtons array (and therefore 
       local storage) and then call the renderButtons function to take it off the screen */ 
    var deletedCity = $("#" + $(this).data("num")).text();
    cityButtons.splice(cityButtons.indexOf(deletedCity), 1);
    renderButtons();
});

