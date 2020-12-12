// get data from open weather api
var getCity = function (city) {
  var cityName = city;
  var apiUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    cityName +
    "&appid=2917f972769da991046e2c6ed6581b39";
  fetch(apiUrl)
    .then(function (response) {
      // request was successful
      if (response.ok) {
        response.json().then(function (data) {
          // create obj with data we will need for other fetches
          cityName = data.name;
          var passedData = {
            lat: data.coord.lat,
            lon: data.coord.lon,
            name: data.name,
          };
          weatherData(passedData);
        });
        addLi(cityName);
      } else {
        alert("Error: " + response.statusText);
        return;
      }
    })
    .catch(function (error) {
      alert("Unable to connect to Open Weather");
    });
};

// get all weather data
var weatherData = function (passedData) {
  var apiUrl =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    passedData.lat +
    "&lon=" +
    passedData.lon +
    "&exclude=minutely,hourly,alerts&units=imperial&appid=2917f972769da991046e2c6ed6581b39";
  fetch(apiUrl)
    .then(function (response) {
      // request was successful
      if (response.ok) {
        response.json().then(function (data) {
          var cityObj = {
            name: passedData.name,
            date: moment.unix(data.current.dt).format("MMM. Do YYYY"),
            icon: data.current.weather[0].icon,
            temp: data.current.temp,
            humidity: data.current.humidity,
            windSpeed: data.current.wind_speed,
            uvIndex: data.current.uvi,
          };
          //store future data
          var forecastData = data.daily;
          displayCurrentData(cityObj, forecastData);
        });
      } else {
        alert("Error: " + response.statusText);
        return;
      }
    })
    .catch(function (error) {
      alert("Unable to connect to Open Weather");
    });
};

// get current weather data from fetch function
var displayCurrentData = function (dataObj, forecastData) {
  // clear the data card
  $("#current-card").empty();

  // add the name and date for the header
  var currentHeader = document.createElement("h1");
  currentHeader.classList = "current-header card-title p-3 mb-2";
  currentHeader.textContent = dataObj.name + ", " + dataObj.date;
  $("#current-card").append(currentHeader);

  // get icon from url
  var currentIcon = document.createElement("img");
  currentIcon.src =
    "http://openweathermap.org/img/wn/" + dataObj.icon + "@2x.png";
  $(".current-header").append(currentIcon);

  //add a background to the UV index value WE NEED TO MAKE THIS DYNAMICALLY CHANGE CLASSES
  var uvEl = document.createElement("li");
  uvEl.classList = "current-data-list p-3 mb-2";
  uvEl.innerHTML =
    "<p id='test'>UV Index:<span class='extreme'>" +
    dataObj.uvIndex +
    "</span></p>";

  // get a list of the other weather metrics
  // create array to loop through and populate a list
  var metricArray = [
    "Temperature: " + dataObj.temp + " ℉",
    "Humidity: " + dataObj.humidity + "%",
    "Wind Speed: " + dataObj.windSpeed + " MPH",
  ];
  // create loop to populate list
  for (i = 0; i < metricArray.length; i++) {
    var listEl = document.createElement("li");
    listEl.classList = "current-data-list p-3 mb-2";
    listEl.textContent = metricArray[i];
    $("#current-card").append(listEl);
  }

  $("#current-card").append(uvEl);
  displayForecastData(forecastData);
};

var displayForecastData = function (forecastData) {
  // clear the forecast div
  $("#forecast-div").empty();
  // initiate array to hold the new object data
  var forecastArr = [];
  //loop through data to get what we need and push it to an array for the next 5 days
  for (i = 1; i < 6; i++) {
    var forecastObj = {
      date: moment.unix(forecastData[i].dt).format("MMM. Do YYYY"),
      icon: forecastData[i].weather[0].icon,
      temp: "Temp: " + forecastData[i].temp.day + " ℉",
      humidity: "Humidity: " + forecastData[i].humidity + "%",
    };
    forecastArr.push(forecastObj);
  }
  //loop through array to add its data to page in cards
  for (i = 0; i < forecastArr.length; i++) {
    var forecastCardEl = document.createElement("div");
    forecastCardEl.classList =
      "forecast-card-El col-12 col-lg-2 card mb-2 p-3 bg-primary text-white";

    //create date header and append it to forecastcardEl
    var dateHeader = document.createElement("h4");
    dateHeader.classList = "current-header p-3 mb-2";
    dateHeader.textContent = forecastArr[i].date;
    forecastCardEl.appendChild(dateHeader);

    //create img to hold icon and append it to forecastcardEl
    var forecastIcon = document.createElement("img");
    forecastIcon.src =
      "http://openweathermap.org/img/wn/" + forecastArr[i].icon + "@2x.png";
    forecastIcon.classList = "forecast-icon";
    forecastCardEl.appendChild(forecastIcon);

    //create li with the rest of the data
    var listTempEl = document.createElement("li");
    listTempEl.classList = "forecast-data-list p-3 mb-2";
    listTempEl.textContent = forecastArr[i].temp;
    forecastCardEl.appendChild(listTempEl);

    var listHumidEl = document.createElement("li");
    listHumidEl.classList = "forecast-data-list p-3 mb-2";
    listHumidEl.textContent = forecastArr[i].humidity;
    forecastCardEl.appendChild(listHumidEl);

    //add the cards to the page
    $("#forecast-div").append(forecastCardEl);
  }
};
// add to history list
var addLi = function (cityName) {
  // get array of current history
  var currentHistory = [];
  $(".search-history li").each(function () {
    currentHistory.push($(this).attr("data-city"));
  });

  // add the city name to our history list if it is not already there
  if (currentHistory.includes(cityName) === false) {
    var listEl = document.createElement("li");
    listEl.classList = "list-group-item p-3";
    listEl.setAttribute("data-city", cityName);
    listEl.textContent = cityName;
    $(".search-history").prepend(listEl);
  }
  saveHistory();
};

//function that will load our history list from localstorage
var loadHistory = function () {
  // pull data from local storage
  var history = localStorage.getItem("history");
  history = JSON.parse(history);

  // check is history array is empty
  if (!history) {
    return;
  }
  // append history onto page
  for (i = 0; i < history.length; i++) {
    var listEl = document.createElement("li");
    listEl.classList = "list-group-item p-3 align-top";
    listEl.setAttribute("data-city", history[i]);
    listEl.textContent = history[i];
    $(".search-history").append(listEl);
  }
};

//function that will save our history list to localstorage
var saveHistory = function () {
  // clear out current value
  localStorage.clear();

  //initiate array to hold past search items
  var historyArr = [];

  // push all list objects into historyArr
  $(".search-history li").each(function () {
    historyArr.push($(this).attr("data-city"));
  });
  //remove duplicates
  historyArr = [...new Set(historyArr)];
  // push array into localstorage
  localStorage.setItem("history", JSON.stringify(historyArr));
};

// send text entry from client to weather api as a city
$("#button-addon2").on("click", function () {
  var cityName = $(".form-control").val().trim();
  // check if the city name is blank or not
  if (cityName) {
    // convert the name to to be lower case with the first letter uppercase
    cityName =
      cityName.charAt(0).toUpperCase() + cityName.toLowerCase().slice(1);

    //clear the text box
    $(".form-control").val("");
    // call the function to fetch the api with the city name we passed in
    getCity(cityName);
  } else {
    alert("Please enter a city name!");
    return;
  }
});

// on click remove the li elements from page and clear storage
$("#remove-history").on("click", function () {
  $(".search-history").empty();
  $("#current-card").empty();
  $("#forecast-div").empty();
  saveHistory();
});

// click a list element to pass that as a city to the weather api
$("body").on("click", ".list-group-item", function () {
  var cityName = $(this).attr("data-city");
  getCity(cityName);
});
// load history list from local storage on page load
loadHistory();
