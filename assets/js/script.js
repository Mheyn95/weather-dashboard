// get data from openweather api
var getCityWeather = function (city) {
  var cityName = "city";
  var apiUrl =
    "https://api.openweathermap.org/data/2.5/weather?q={" +
    cityName +
    "}&appid={2917f972769da991046e2c6ed6581b39}";

  fetch(apiUrl)
    .then(function (response) {
      // request was successful
      if (response.ok) {
        response.json().then(function (data) {
          console.log(data);
        });
      } else {
        alert("Error: " + response.statusText);
      }
    })
    .catch(function (error) {
      alert("Unable to connect to Open Weather");
    });
};

$("#button-addon2").on(
  "click",
  (sendCity = function () {
    var cityName = $(".form-control").val();
    // check if the city name is blank or not
    if (cityName) {
      // convert the name to to be lower case with the first letter uppercase
      cityName =
        cityName.charAt(0).toUpperCase() + cityName.toLowerCase().slice(1);

      // call the function to fetch the api with the city name we passed in
      getCityWeather(cityName);

      // add the city name to our history list
      var listEl = document.createElement("li");
      listEl.classList = "list-group-item";
      listEl.setAttribute("data-city", cityName);
      listEl.textContent = cityName;
      $(".search-history").append(listEl);
    } else {
      alert("Please enter a city name!");
      return;
    }
  })
);
