var apiKey1 = "d3d6560ad567216dabcc0351c22d0fad";
var apiKey2 = "41490cc9c30ac5171880367eb41b32e3";
var apiKey3 = "c8365256edd594643ad843e3f1e0c7ad";

city = "seattle";
var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + apiKey3;

function convertDate(timeStamp) {
    return new Date(timeStamp * 1000).toLocaleString("en-US", {
        month: "numeric",
        day: "numeric",
        year: "numeric"
    });
};

$.ajax({
    url: queryURL,
    method: "GET"
}).then(function(response) {
    console.log(response);
    console.log(response.name);
    var name = response.name;
    var date = convertDate(response.dt);
    console.log(date);
    var temp = response.main.temp;
    console.log(temp);
    var humidity = response.main.humidity;
    console.log(humidity);
    var wind = response.wind.speed;
    console.log(wind);
    var lat = response.coord.lat;
    var lon = response.coord.lon;
    var oneCallURL = "http://api.openweathermap.org/data/2.5/onecall?units=imperial&lat=" + lat + "&lon=" + lon + "&appid=" + apiKey2;
    $.ajax({
        url: oneCallURL,
        method: "GET"
    }).then(function(response) {
        console.log(response);
        console.log("this one");
        var iconURL = "http://openweathermap.org/img/wn/" + response.current.weather[0].icon + "@2x.png";
        var uvIndex = response.current.uvi;
    })
});

