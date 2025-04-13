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
  // Do something with the search term
}

async function getCity(cityName) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${cityName}&count=10&language=en&format=json`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    // console.log(json);
    const city = json.results[0].name;
    const cityLatitude = json.results[0].latitude;
    const cityLongitude = json.results[0].longitude;
    getWeather(cityLatitude, cityLongitude);
    // console.log(city, cityLatitude, cityLongitude);
  } catch (error) {
    console.error(error.message);
  }
}

// getData();

async function getWeather(latitude, longitude) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weather_code&current=temperature_2m,relative_humidity_2m,wind_speed_10m`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const json = await response.json();
    console.table(json);
    const currentWeather = json.daily;
    console.log(currentWeather.weather_code);
  } catch (error) {
    console.error(error.message);
  }
}

// getWeather();
