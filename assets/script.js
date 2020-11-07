var apiKey1 = "d3d6560ad567216dabcc0351c22d0fad";
var apiKey2 = "41490cc9c30ac5171880367eb41b32e3";
var apiKey3 = "c8365256edd594643ad843e3f1e0c7ad";

city = "los angeles";
var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + apiKey3;

var lat = "";
var lon = "";

$.ajax({
    url: queryURL,
    method: "GET"
}).then(function(response) {
    console.log(response);
    lat = response.coord.lat;
    lon = response.coord.lon;
    console.log(lat);
    var uvURL = "http://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey2;
    $.ajax({
        url: uvURL,
        method: "GET"
    }).then(function(response) {
        console.log(response);
    })
});

