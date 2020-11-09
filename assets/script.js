var apiKey1 = "d3d6560ad567216dabcc0351c22d0fad";
var apiKey2 = "41490cc9c30ac5171880367eb41b32e3";
var apiKey3 = "c8365256edd594643ad843e3f1e0c7ad";
var cityButtons = [];

var checkStorage = JSON.parse(localStorage.getItem("cities"));
if (checkStorage) {
    checkStorage.forEach(function(city) {
        cityButtons.push(city);
    })
    localStorage.setItem("cities", JSON.stringify(cityButtons));

    getWeather(cityButtons[cityButtons.length - 1]);
}

function convertDate(timeStamp) {
    return new Date(timeStamp * 1000).toLocaleString("en-US", {
        month: "numeric",
        day: "numeric",
        year: "numeric"
    });
};
function getWeather(city) {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + apiKey3;
    console.log(queryURL);
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {
        var name = response.name;
        $("#city-name").text(name + " (" + convertDate(response.dt) + ")");
        $("#current-temp").text(response.main.temp + " °F");
        $("#current-humidity").text(response.main.humidity + "%");
        $("#current-wind").text(response.wind.speed + " MPH");
        var oneCallURL = "https://api.openweathermap.org/data/2.5/onecall?units=imperial&lat=" + response.coord.lat + "&lon=" + response.coord.lon + "&appid=" + apiKey2;
        $.ajax({
            url: oneCallURL,
            method: "GET"
        }).then(function(response) {
            console.log(response);
            var iconURL = "http://openweathermap.org/img/wn/" + response.current.weather[0].icon + "@2x.png";
            $("#current-icon").attr("src", iconURL);
            $("#description").text(response.current.weather[0].description);
            var uvIndex = response.current.uvi;
            $("#uv").text(uvIndex);
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
            $("#forecast-cards").empty();
            for (var i = 1; i < 6; i++) {
                var col = $("<div class='col-8 col-sm-4 col-xl-auto'>");
                var card = $("<div class='card forecast'>");
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
            }
        })
        if (!cityButtons.includes(name)) {
            cityButtons.push(name);
        };
        renderButtons();
    });
};
$(".fa-search").on("click", function(event) {
    event.preventDefault();
    if ($("#city-input").val()) {
        var city = $("#city-input").val().split(" ").join("+");
        $("#city-input").val("");
        getWeather(city);
    }
})

$("#button-list").on("click", 'li.city-button', function() {
    getWeather($(this).text());
})

$("#button-list").on("click", 'button.fa-backspace', function(event) {
    event.stopPropagation();
    var deletedCity = $("#" + $(this).val()).text();
    cityButtons.splice(cityButtons.indexOf(deletedCity), 1);
    renderButtons();
})

function renderButtons() {
    $("#button-list").empty();
    for (var i = 0; i < cityButtons.length; i++) {
        var newCityBtn = $("<li class='list-group-item city-button' id='button" + i + "'>");
        newCityBtn.text(cityButtons[i]);
        var deleteBtn = $("<button class='fa fa-backspace btn float-right' value='button" + i + "'>");
        newCityBtn.append(deleteBtn);
        $("#button-list").prepend(newCityBtn);
        }
    localStorage.setItem("cities", JSON.stringify(cityButtons));
}
