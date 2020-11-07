var apiKey1 = "d3d6560ad567216dabcc0351c22d0fad";
var apiKey2 = "41490cc9c30ac5171880367eb41b32e3";
var apiKey3 = "c8365256edd594643ad843e3f1e0c7ad";

city = "seattle";
var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + apiKey3;
var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?units=imperial&q=" + city + "&appid=" + apiKey1;

$.ajax({
    url: queryURL,
    method: "GET"
}).then(function(response) {
    console.log(response);
    console.log(response.name);
    var name = response.name;
    var timeStamp = response.dt * 1000;
    var date = new Date(timeStamp);
    console.log(date);
    console.log(date.toLocaleString());
    console.log(response.main.temp);
    console.log(response.main.humidity);
    console.log(response.wind.speed);
    var lat = response.coord.lat;
    var lon = response.coord.lon;
    var uvURL = "http://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey2;
    $.ajax({
        url: uvURL,
        method: "GET"
    }).then(function(response) {
        console.log(response);
        console.log(response.value);
    });
    var oneCallURL = "http://api.openweathermap.org/data/2.5/onecall?units=imperial&lat=" + lat + "&lon=" + lon + "&appid=" + apiKey2;
    $.ajax({
        url: oneCallURL,
        method: "GET"
    }).then(function(response) {
        console.log(response);
    })
});

$.ajax({
    url: forecastURL,
    method: "GET"
}).then(function(response) {
    console.log(response);
});

// instructions on website how to set icons
var iconURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png"

