const weatherIcon = document.querySelector(".weather-icon");

//Permission request
function requestLocation() {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      document.getElementById('weather-permission').style.display = 'none';
      document.getElementById('weather-content').style.display = 'flex';
      checkWeatherByCoords(lat, lon);
    },
    () => {
      document.querySelector('.permission-label').innerHTML = 
        "Location denied. The rain couldn't reach you.";
    }
  );
}

//Weather API
async function checkWeatherByCoords(lat, lon) {
const geoResponse = await fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
  );
  //we NEED to take back the city
  const geoData = await geoResponse.json();
  const cityName = geoData.address.city || geoData.address.town || geoData.address.village || geoData.address.county;
  document.querySelector(".city").innerHTML = cityName;

  console.log("fetching weather for", lat, lon);
  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weathercode`
  );
  const data = await response.json();

  document.querySelector(".temp").innerHTML = Math.round(data.current.temperature_2m) + "°C";
  document.querySelector(".humidity").innerHTML = data.current.relative_humidity_2m + "%";
  document.querySelector(".wind").innerHTML = data.current.wind_speed_10m + " km/h";


  // Icon changes
  const condition = data.current.weathercode;
  if (condition === 0) {
    weatherIcon.src = "./ASSETS/weather-images/clear.png";} 
    else if (condition <= 3) {
    weatherIcon.src = "./ASSETS/weather-images/clouds.png";
  } 
    else if (condition <= 48) {
    weatherIcon.src = "./ASSETS/weather-images/mist.png";
  } 
    else if (condition <= 55) {
    weatherIcon.src = "./ASSETS/weather-images/drizzle.png";
  } 
    else if (condition <= 67) {
    weatherIcon.src = "./ASSETS/weather-images/rain.png";
  } 
    else if (condition <= 77) {
    weatherIcon.src = "./ASSETS/weather-images/snow.png";
  } 
    else if (condition <= 82) {
    weatherIcon.src = "./ASSETS/weather-images/rain.png";
  } 
  else if (condition <= 86) {
    weatherIcon.src = "./ASSETS/weather-images/snow.png";
  } 
    else if (condition >= 95) {
    weatherIcon.src = "./ASSETS/weather-images/rain.png";
  }
}