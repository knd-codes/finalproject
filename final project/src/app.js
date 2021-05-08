const apiKey = "2cb853fead8f2aa7c43c8a85cd731392";
const apiUrlCurrentWeather = "https://api.openweathermap.org/data/2.5/weather?";
const apiUrlForecast ="https://api.openweathermap.org/data/2.5/forecast?";
const units = "metric";

function searchCity(city) {
  let apiCurrentWeatherSearch= `${apiUrlCurrentWeather}q=${city}&appid=${apiKey}&units=${units}`;
  axios.get(apiCurrentWeatherSearch).then(displayCurrentWeather);

  celsiusLink.removeEventListener("click", convertToCelsius);
  fahrenheitLink.addEventListener("click", convertToFahrenheit);

  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
}

function handleSubmit(event) {
  event.preventDefault();
  let inputCity = document.querySelector("#input-city");
  searchCity(inputCity.value);
}

let searchCityForm = document.querySelector("#search-city-form");
searchCityForm.addEventListener("submit", handleSubmit);

let searchButton = document.querySelector("#search-button");
searchButton.addEventListener("click", handleSubmit);

function searchLocation(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;

  let apiSearch = `${apiUrlCurrentWeather}lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}`;
  axios.get(apiSearch).then(displayCurrentWeather);     


  celsiusLink.removeEventListener("click", convertToCelsius);
  fahrenheitLink.addEventListener("click", convertToFahrenheit);

  celsiusLink.classList.add("active");
  fahrenheitlink.classList.remove("active");
}

function getGeolocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(searchLocation);
}

let geolocationButton = document.querySelector("#location-button");
geolocationButton.addEventListener("click", getGeolocation);

function formatDate(date, timezone) {
  let localOffsetInMs = date.getTimezoneOffset() * 60 * 1000;
  let targetOffsetInMs = timezone * 1000;
  let targetTimestamp = date.getTime() + localOffsetInMs + targetOffsetInMs;

  let now = new Date(targetTimestamp);

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];
  let day = days[now.getDay()];
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "October",
    "November",
    "December"
  ];
  let month = months[now.getMonth()];
  let dayIndex = now.getDate();
  let year = now.getFullYear();

  let hours = now.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = now.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  let currentTime = `${hours}:${minutes}`;
  let dateTimeElement = document.querySelector("#current-date-and-time");
  dateTimeElement.innerHTML = `${day}, ${month} ${dayIndex}, ${year} ${currentTime}`;

  let formattedDate = `${day} - ${month} ${dayIndex}, ${year} &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;${currentTime}`;

  return formattedDate;
}

function getIcon(icon){
  let iconElement ="";
  if(icon === "01d") {
    iconElement = "img/01d.png";
  } else if (icon === "01n") {
    iconElement = "img/01n.png";
  } else if (icon === "02d") {
    iconElement = "img/02d.png";
  } else if (icon === "02n") {
    iconElement = "img/02n.png";
  } else if (icon === "03d") {
    iconElement = "img/03d.png";
  } else if (icon === "03n") {
    iconElement = "img/03n.png";
  } else if (icon === "04d") {
    iconElement = "img/04d.png";
  } else if (icon === "04n") {
    iconElement = "img/04n.png";
  } else if (icon === "09d") {
    iconElement = "img/09d.png";
  } else if (icon === "09n") {
    iconElement = "img/09n.png"; 
  } else if (icon === "10d") {
    iconElement = "img/10d.png";
  } else if (icon === "10n") {
    iconElement = "img/10n.png";
  } else if (icon === "11d") {
    iconElement = "img/11d.png";
  } else if (icon === "11n") {
    iconElement = "img/11n.png";
  } else if (icon === "13d") {
    iconElement = "img/13d.png";
    } else if (icon === "13n") {
    iconElement = "img/13n.png";
  } else if (icon === "50d") {
    iconElement = "img/50d.png";
  } else if (icon === "50n") {
    iconElement = "img/50n.png";
  }
  return iconElement;
}

function displayCurrentWeather(response) {

  document.querySelector("#city").innerHTML = response.data.name
  document.querySelector("#current-date-and-time").innerHTML = formatDate(new Date(), response.data.timezone);
  
  document
    .querySelector("#weather-icon")
    .setAttribute("src", getIcon(response.data.weather[0].icon));
  
  document.querySelector("#weather-description").innerHTML = response.data.weather[0].description;
  
  celsiusTemperature = response.data.main.temp;
  document.querySelector("#current-temperature").innerHTML =`${Math.round(celsiusTemperature) + "°"}`;

  document.querySelector("#maximum-temperature").innerHTML =" " + Math.round(response.data.main.temp_max) + "°";
  document.querySelector("#minimum-temperature").innerHTML =" " + Math.round(response.data.main.temp_min) + "°";
  celsiusMaxTemperature = response.data.main.temp_max;
  celsiusMinTemperature = response.data.main.temp_min;
  document.querySelector("#humidity").innerHTML =  " " + response.data.main.humidity + "%";
  document.querySelector("#wind").innerHTML = " " + Math.round(response.data.wind.speed) + " mph";
  
  
  let longitude = response.data.coord.lon;
  let latitude = response.data.coord.lat;
  fetchDailyForecast(latitude, longitude);
}

function getNameOfWeekDay(timestamp) {
  let date = new Date (timestamp);
  let weekDays = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];
  let weekDay = weekDays [date.getDay()];
  return `${weekDay}`;
 }

 function fetchDailyForecast(latitude, longitude) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=current,minutely,hourly,alerts&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(displayDailyForecast);
}

function displayDailyForecast(response) {
  let dailyForecastElement = document.querySelector("#daily-forecast");
  dailyForecastElement.innerHTML = null;
  let dailyForecast = null;

  for (let index = 1; index < 7; index++) {
    dailyForecast = response.data.daily[index];

    dailyForecastElement.innerHTML += `
    <div class="col day-forecast">
    ${getNameOfWeekDay (dailyForecast.dt * 1000)}
    <div class="col weather-icon-forecast">
     <img src="${getIcon(dailyForecast.weather[0].icon)}" width="26" height="26"/>
    </div>
    <div class="col" id="day-temperature-forecast">
   ${Math.round(dailyForecast.temp.day)}°
    </div>
    </div>`;
  }
}
 
function convertToCelsius(event) {
  event.preventDefault();

  document.querySelector("#current-temperature").innerHTML = Math.round(celsiusTemperature) + "°";
  document.querySelector ("#minimum-temperature").innerHTML = Math.round (celsiusMinTemperature) + "°" ;
  document.querySelector ("#maximum-temperature").innerHTML = Math.round (celsiusMaxTemperature) + "°";

  convertDailyForecast ("celsius");

  celsiusLink.removeEventListener("click", convertToCelsius);
  fahrenheitLink.addEventListener("click", convertToFahrenheit);
}

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", convertToCelsius);

let celsiusTemperature = null;
let celsiusTemperatureFeelsLike = null;
let celsiusMinTemperature = null;
let celsiusMaxTemperature = null;

function convertToFahrenheit(event) {
  event.preventDefault();

  let fahrenheitTemperature = (celsiusTemperature * 9) / 5 + 32;
  let temperatureElement = document.querySelector("#current-temperature");
  temperatureElement.innerHTML = Math.round(fahrenheitTemperature)+"°";

  let fahrenheitMinTemperature = (celsiusMinTemperature * 9) / 5 + 32;
  document.querySelector ("#minimum-temperature").innerHTML = Math.round (fahrenheitMinTemperature) + "°";

  let fahrenheitMaxTemperature = (celsiusMaxTemperature * 9) / 5 + 32;
  document.querySelector ("#maximum-temperature").innerHTML = Math.round (fahrenheitMaxTemperature) + "°";

  convertDailyForecast("fahrenheit");

  celsiusLink.addEventListener("click", convertToCelsius);
  fahrenheitLink.removeEventListener("click", convertToFahrenheit);
}

let fahrenheitLink = document.querySelector("#fahrenheit-link");
fahrenheitLink.addEventListener("click", convertToFahrenheit);

function convertDailyForecast(unit) {
  if (unit === "celsius") {
    document
      .querySelectorAll("#day-temperature-forecast")
      .forEach(function (temperature) {
        let currentTemperature = temperature.innerHTML.replace("°", "");
        temperature.innerHTML = `${Math.round(
          ((currentTemperature - 32) * 5) / 9
        )}°`;
      });
  } else {
    document
      .querySelectorAll("#day-temperature-forecast")
      .forEach(function (temperature) {
        let currentTemperature = temperature.innerHTML.replace("°", "");
        temperature.innerHTML = `${Math.round(
          (currentTemperature * 9) / 5 + 32
        )}°`;
      });
  }
}

searchCity("Dallas");