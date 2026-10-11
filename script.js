const cityinput = document.getElementById("cityinput");
const btn = document.getElementById("btn");
const weatherinfo = document.getElementById("weatherinfo");
const cityname = document.getElementById("cityname");
const temperature = document.getElementById("temperature");
const condition = document.getElementById("condition");
const humidity = document.getElementById("humidity");
const wind = document.getElementById("wind");

btn.addEventListener("click", getweather);

async function getweather() {
  const city = cityinput.value.trim();

  if (!city) {
    alert("Please enter a city name");
    return;
  }

  weatherinfo.style.display = "block";
  condition.textContent = "Loading...";

  try {
    const geourl =
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
    const georesponse = await fetch(geourl);

    if (!georesponse.ok) throw new Error("Geocoding request failed");

    const geodata = await georesponse.json();

    if (!geodata.results?.length) {
      alert("City not found");
      weatherinfo.style.display = "none";
      return;
    }

    const location = geodata.results[0];
    const weatherurl =
      `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m`;

    const weatherresponse = await fetch(weatherurl);

    if (!weatherresponse.ok) throw new Error("Weather request failed");

    const weatherdata = await weatherresponse.json();
    const current = weatherdata.current;

    let weathercondition;

    const code = current.weather_code;

    if (code === 0) weathercondition = "Clear sky";
    else if (code === 1 || code === 2) weathercondition = "Partly cloudy";
    else if (code === 3) weathercondition = "Cloudy";
    else if (code >= 51 && code <= 67) weathercondition = "Rainy";
    else if (code >= 71 && code <= 77) weathercondition = "Snowy";
    else if (code >= 80 && code <= 82) weathercondition = "Rain showers";
    else if (code >= 95) weathercondition = "Thunderstorm";
    else weathercondition = "Unknown";

    cityname.textContent = location.name;
    temperature.textContent = `Temperature: ${current.temperature_2m}°C`;
    humidity.textContent = `Humidity: ${current.relative_humidity_2m}%`;
    wind.textContent = `Wind: ${current.wind_speed_10m} km/h`;
    condition.textContent = weathercondition;
  } catch (error) {
    console.error(error);
    condition.textContent = "Could not load weather";
    alert("Something went wrong. Please try again.");
  }
}

cityinput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") getweather();
});
