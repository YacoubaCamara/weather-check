const citySelected = document.querySelector(".location");
const illustrativeImage = document.querySelector(".temperature-img");
let temperature = document.querySelector(".temperature");
let weatherDescription = document.querySelector(".weather-description");
let humidity = document.querySelector(".humidity");
let wind = document.querySelector(".wind");
const darkModeBtn = document.querySelector(".dark-mode-btn");

let value = ""; // Global variable to store value

document
  .querySelector(".search-input")
  .addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      value = e.target.value;
      console.log("User searched for", value); // Inside listener
      // Call some function with the updated value
      handleSearch(value);
    }
  });

function handleSearch(city) {
  console.log("Handling search for:", city);
  getCity(city);
}

async function getCity(cityName) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=10&language=en&format=json`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const json = await response.json();
    const city = json.results[0].name;
    const cityLatitude = json.results[0].latitude;
    const cityLongitude = json.results[0].longitude;
    const weather = getWeather(cityLatitude, cityLongitude);
    replaceDummyData(
      city,
      (await weather).imgCode,
      (await weather).temperature,
      (await weather).weatherDescription,
      (await weather).humidity,
      (await weather).wind
    );
    document.querySelector(".template").classList.remove("hidden");
  } catch (error) {
    console.error(error.message);
  }
}

async function getWeather(latitude, longitude) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weather_code&current=temperature_2m,relative_humidity_2m,wind_speed_10m`;
  let wmoCode = 0;
  let imgCode = 0;
  let weatherDescription = "";
  let temperature = null;
  let humidity = null;
  let wind = null;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const json = await response.json();
    console.table(json);
    const currentWeather = json.daily;
    console.log(currentWeather.weather_code);
    console.log(currentWeather.weather_code[0]);

    wmoCode = currentWeather.weather_code[0];
    const descriptionWmoCode = wmoCodeInterpretation(wmoCode);
    weatherDescription = descriptionWmoCode.description;
    imgCode = descriptionWmoCode.imgCode;
    temperature = json.current.temperature_2m;
    humidity = json.current.relative_humidity_2m;
    wind = json.current.wind_speed_10m;
    // console.log(descriptionWmoCode.description);
    // console.log(descriptionWmoCode.imgCode);
  } catch (error) {
    console.error(error.message);
  }
  return { wmoCode, weatherDescription, imgCode, temperature, humidity, wind };
}

function replaceDummyData(
  city,
  imgCode,
  actualTemperature,
  actualWeatherDescription,
  actualHumidity,
  actualWindSpeed
) {
  citySelected.innerHTML = city;
  illustrativeImage.src = `./img/imgCode/${imgCode}.png`;
  temperature.innerHTML = actualTemperature + "°C";
  weatherDescription.innerHTML = actualWeatherDescription;
  humidity.innerHTML = actualHumidity + "%";
  wind.innerHTML = actualWindSpeed + " km/h";
}

function wmoCodeInterpretation(wmoCode) {
  let description = "";
  let imgCode = 0;
  switch (wmoCode) {
    case 0:
      description = "Clear sky";
      imgCode = 0;
      break;
    case 1:
    case 2:
    case 3:
      description = "Mainly clear, partly cloudy, and overcast";
      imgCode = 1;
      break;
    case 45:
    case 48:
      description = "Fog and depositing rime fog";
      imgCode = 2;
      break;
    case 51:
    case 53:
    case 55:
      description = "Drizzle: Light, moderate, and dense intensity";
      imgCode = 3;
      break;
    case 56:
    case 57:
      description = "Freezing Drizzle: Light and dense intensity";
      imgCode = 3;
      break;
    case 61:
    case 63:
    case 65:
      description = "	Rain: Slight, moderate and heavy intensity";
      imgCode = 5;
      break;
    case 66:
    case 67:
      description = "Freezing Rain: Light and heavy intensity";
      imgCode = 5;
      break;
    case 71:
    case 73:
    case 75:
      description = "Snow fall: Slight, moderate, and heavy intensity";
      imgCode = 6;
      break;
    case 77:
      description = "Snow grains";
      imgCode = 7;
      break;
    case 80:
    case 81:
    case 82:
      description = "Rain showers: Slight, moderate, and violent";
      imgCode = 8;
      break;
    case 85:
    case 86:
      description = "Snow showers slight and heavy";
      imgCode = 6;
      break;
    case 95:
      description = "Thunderstorm: Slight or moderate";
      imgCode = 9;
      break;
    case 96:
    case 99:
      description = "Thunderstorm with slight and heavy hail";
      imgCode = 9;
      break;
    default:
      description = "Clear sky";
      imgCode = 0;
  }
  return { description, imgCode };
}

darkModeBtn.addEventListener("click", (e) => {
  console.log("click");
  e.preventDefault();
  darkMode();
});

function darkMode() {
  document.body.classList.toggle("dark-mode");
  if (document.body.classList.contains("dark-mode")) {
    darkModeBtn.innerHTML = "Light Mode";
  } else darkModeBtn.innerHTML = "Dark Mode";
}

// getWeather();
