var apiKey1 = "d3d6560ad567216dabcc0351c22d0fad";
var apiKey2 = "41490cc9c30ac5171880367eb41b32e3";
var apiKey3 = "c8365256edd594643ad843e3f1e0c7ad";
var lat = "";
var lon = "";

var uvURL = "http://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey1;

city = "Seattle";
var queryURL = "api.openweathermap.org/data/2.5/weather?units=imperial&q=" + city + "&appid=" + apiKey3;

console.log(queryURL);
$.ajax({
    url: queryURL,
    method: "GET"
}).then(function(response) {
    console.log(response);
});