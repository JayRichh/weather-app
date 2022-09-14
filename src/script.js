const locationInput = document.getElementById("location-input");
const errorMessage = document.getElementById("error-message");
const unitButton = document.getElementById("change-units");

locationInput.addEventListener("keypress", async (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    getWeather(locationInput.value);
  }
});
document.addEventListener("DOMContentLoaded", getLocationOnLoad);
unitButton.addEventListener("click", convertUnits);

async function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  })
    .then((position) => {
      return position;
    })
    .catch((error) => {
      errorMessage.textContent = error.message;
    });
}

async function getLocationOnLoad() {
  // get users location on load and update weather data
  const position = await getCurrentPosition();
  const { latitude, longitude } = position.coords;
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=3b6250101aeaef786b575f520ceec263&units=metric`
  );
  const data = await response.json();
  const location = data.name;
  getWeather(location);
}

async function getWeather(location) {
  // Check if units button is active
  let units = unitButton.classList.contains("active") ? "imperial" : "metric";
  try {
    showSpinner();
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=3b6250101aeaef786b575f520ceec263&units=${units}`
    );
    const data = await response.json();
    const weather = {
      status: data.weather[0].main,
      location: data.name,
      temp: `${data.main.temp}`,
      feels: `${data.main.feels_like}`,
      humidity: `${data.main.humidity}%`,
      wind: `${data.wind.speed} m/s`,
      icon: `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`,
    };
    processWeather(weather);
  } catch (error) {
    console.log(error);
  } finally {
    hideSpinner();
  }
}

function convertUnits() {
  unitButton.classList.toggle("active");
  const temp = document.getElementById("temperature-reading");
  const feelsLikeTemp = document.getElementById("feels-like");
  let units = document.querySelectorAll("#units");

  function cToF(celsius) {
    const cTemp = celsius;
    const cToFahr = (cTemp * 9) / 5 + 32;
    return cToFahr;
  }
  function fToC(fahrenheit) {
    const fTemp = fahrenheit;
    const fToCel = ((fTemp - 32) * 5) / 9;
    return fToCel;
  }

  if (units[0].textContent === "℃") {
    temp.textContent = cToF(temp.textContent).toFixed(2);
    feelsLikeTemp.textContent = cToF(feelsLikeTemp.textContent).toFixed(2);
    units[0].textContent = "℉";
    units[1].textContent = "℉";
  } else {
    temp.textContent = fToC(temp.textContent).toFixed(2);
    feelsLikeTemp.textContent = fToC(feelsLikeTemp.textContent).toFixed(2);
    units[0].textContent = "℃";
    units[1].textContent = "℃";
  }
}

function processWeather(weather) {
  const { status, location, temp, feels, humidity, wind, icon } = weather;
  const weatherIcon = document.getElementById("weather-icon");
  const weatherStatus = document.getElementById("forecast-description");
  const weatherLocation = document.getElementById("location-display");
  const weatherTemp = document.getElementById("temperature-reading");
  const weatherFeels = document.getElementById("feels-like");
  const weatherHumidity = document.getElementById("humidity");
  const weatherWind = document.getElementById("wind");
  weatherIcon.src = icon;
  weatherStatus.textContent = status;
  weatherLocation.textContent = location;
  weatherTemp.textContent = temp;
  weatherFeels.textContent = feels;
  weatherHumidity.textContent = humidity;
  weatherWind.textContent = wind;
}

function showSpinner() {
  const loadingDiv = document.querySelector(".loading-spinner");
  loadingDiv.classList.add("active");
  loadingDiv.innerHTML = `<div class="follow-the-leader">
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>`;
}
function hideSpinner() {
  const loadingDiv = document.querySelector(".loading-spinner");
  loadingDiv.classList.remove("active");
  loadingDiv.innerHTML = "";
}
