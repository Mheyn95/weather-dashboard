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
            date: moment().format("MMMM Do, YYYY"),
            icon: data.current.weather[0].icon,
            temp: data.current.temp,
            humidity: data.current.humidity,
            wideSpeed: data.current.wind_speed,
            uvIndex: data.current.uvi,
          };
          displayCurrentData(cityObj);
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
var displayCurrentData = function (dataObj) {
  console.log(dataObj);
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
    listEl.classList = "list-group-item p-3 mb-2";
    listEl.setAttribute("data-city", cityName);
    listEl.textContent = cityName;
    $(".search-history").append(listEl);
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
    listEl.classList = "list-group-item p-3 mb-2";
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
  saveHistory();
});

// click a list element to pass that as a city to the weather api
$("body").on("click", ".list-group-item", function () {
  var cityName = $(this).attr("data-city");
  getCity(cityName);
});
// load history list from local storage on page load
loadHistory();
