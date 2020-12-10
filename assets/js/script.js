// get data from open weather api
var getCityWeather = function (city) {
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
          console.log(data);
          cityName = data.name;
        });
      } else {
        alert("Error: " + response.statusText);
      }
    })
    .catch(function (error) {
      alert("Unable to connect to Open Weather");
    });
  // get array of current history
  var currentHistory = [];
  $(".search-history li").each(function () {
    currentHistory.push($(this).attr("data-city"));
  });

  // add the city name to our history list if it is not already there
  if (currentHistory.includes(cityName) === false) {
    var listEl = document.createElement("li");
    listEl.classList = "list-group-item";
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
    listEl.classList = "list-group-item";
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
  console.log(historyArr);
  // push array into localstorage
  localStorage.setItem("history", JSON.stringify(historyArr));
};

// send text entry from client to weather api as a city
$("#button-addon2").on("click", function () {
  var cityName = $(".form-control").val();
  // check if the city name is blank or not
  if (cityName) {
    // convert the name to to be lower case with the first letter uppercase
    cityName =
      cityName.charAt(0).toUpperCase() + cityName.toLowerCase().slice(1);

    //clear the text box
    $(".form-control").val("");
    // call the function to fetch the api with the city name we passed in
    getCityWeather(cityName);
  } else {
    alert("Please enter a city name!");
    return;
  }
});

// click a list element to pass that as a city to the weather api
$("body").on("click", ".list-group-item", function () {
  var cityName = $(this).attr("data-city");
  getCityWeather(cityName);
});
// load history list from local storage on page load
loadHistory();
