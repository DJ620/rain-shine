var apiKey1 = "d3d6560ad567216dabcc0351c22d0fad";
var apiKey2 = "41490cc9c30ac5171880367eb41b32e3";
var apiKey3 = "c8365256edd594643ad843e3f1e0c7ad";
var cityButtons = [];

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
        var date = convertDate(response.dt);
        $("#city-name").text(name + " (" + date + ")");
        var temp = response.main.temp;
        $("#current-temp").text(temp + " °F");
        var humidity = response.main.humidity;
        $("#current-humidity").text(humidity + "%");
        var wind = response.wind.speed;
        $("#current-wind").text(wind + " MPH");
        var lat = response.coord.lat;
        var lon = response.coord.lon;
        var oneCallURL = "http://api.openweathermap.org/data/2.5/onecall?units=imperial&lat=" + lat + "&lon=" + lon + "&appid=" + apiKey2;
        $.ajax({
            url: oneCallURL,
            method: "GET"
        }).then(function(response) {
            console.log(response);
            var iconURL = "http://openweathermap.org/img/wn/" + response.current.weather[0].icon + "@2x.png";
            $("#city-name").append("<img src=" + iconURL + " alt='weather icon'>");
            var uvIndex = response.current.uvi;
            $("#uv").text(uvIndex);
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
            for (var i = 1; i < 6; i++) {
                var forecastIconURL = "http://openweathermap.org/img/wn/" + response.daily[i].weather[0].icon + "@2x.png";
                var forecastTemp = response.daily[i].temp.day;
                var forecastHumidity = response.daily[i].humidity;
                var col = $("<div class='col'>");
                var card = $("<div class='card'>");
                var body = $("<div class='card-body bg-primary'>");
                var cardDate = $("<h3 class='card-title text-white'>");
                cardDate.text(convertDate(response.daily[i].dt));
                var cardIcon = $("<img src=" + forecastIconURL + " alt='weather icon'>");
                var cardTemp = $("<p class='card-text text-white'>");
                cardTemp.text("Temp: " + forecastTemp + " °F");
                var cardHumidity = $("<p class='card-text text-white'>");
                cardHumidity.text("Humidity: " + forecastHumidity + "%");
                body.append(cardDate, cardIcon, cardTemp, cardHumidity);
                card.append(body);
                col.append(card);
                $("#forecast-cards").append(col);
            }
        })
        cityButtons.push(name);
        cityButtons.forEach(function(city){
            var newCityBtn = $("<li class='list-group-item city-button'>");
            newCityBtn.text(city);
            $("#button-list").prepend(newCityBtn);
        })
    });
};
$(".btn").on("click", function(event) {
    event.preventDefault();
    if ($("#city-input").val()) {
        var city = $("#city-input").val().split(" ").join("+");
        console.log(city);
        $("#uv").removeClass();
        $("#forecast-cards").empty();
        $("#city-input").val("");
        $("#button-list").empty();
        getWeather(city);
    }
})
