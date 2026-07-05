const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");

async function getCoordinates(city) {
  const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`);
  const data = await response.json();
  
  if (!data.results || data.results.length === 0) {
    document.querySelector(".city").innerHTML = "City not found bro";
    return null;
  }
  
  return {
    lat: data.results[0].latitude,
    lon: data.results[0].longitude,
    name: data.results[0].name 
  };
}

async function checkWeather(city) {
  const coords = await getCoordinates(city);
  if (!coords) return;

  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weathercode`
  );
  const data = await response.json();

  document.querySelector(".city").innerHTML = coords.name;
  document.querySelector(".temp").innerHTML = Math.round(data.current.temperature_2m) + "°C";
  document.querySelector(".humidity").innerHTML = data.current.relative_humidity_2m + "%";
  document.querySelector(".wind").innerHTML = data.current.wind_speed_10m + " km/h";

  console.log(data);
}

searchBtn.addEventListener("click", () => {
  checkWeather(searchBox.value);
});