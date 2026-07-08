const weatherIcon = document.querySelector(".weather-icon");
const weatherBg = document.querySelector(".weather-bg");

const weatherDesc = {
  0: "Summer Breeze", //Clear skies
  1: "Summer Breeze",
  2: "Overcast Skies", //Cloudy
  3: "Overcast Skies",
  45: "Hide and Seek Alone", //Fog or mist
  48: "Hide and Seek Alone",
  51: "Heavy Rain Fall", //HEAVY rain
  53: "Heavy Rain Fall",
  55: "Heavy Rain Fall",
  61: "It's Raining After All", //Light to moderate rain
  63: "It's Raining After All",
  65: "It's Raining After All",
  66: "It's Raining After All",
  67: "It's Raining After All",
  71: "When Morning Glory Falls", //Snow
  73: "When Morning Glory Falls",
  75: "When Morning Glory Falls",
  77: "When Morning Glory Falls",
  80: "It's Raining After All",
  81: "It's Raining After All",
  82: "Heavy Rain Fall",
  85: "When Morning Glory Falls",
  86: "When Morning Glory Falls",
  95: "Heavy Rain Fall",
  96: "Heavy Rain Fall",
  99: "Heavy Rain Fall"
};

const weatherBgs = {
  "Summer Breeze":           "./ASSETS/weather-images/summer_breeze.jpg",
  "Overcast Skies":          "./ASSETS/weather-images/overcast_skies.jpg",
  "Hide and Seek Alone":     "./ASSETS/weather-images/hide_and_seek_alone.jpg",
  "Heavy Rain Fall":         "./ASSETS/weather-images/rain_fall.jpg",
  "It's Raining After All":  "./ASSETS/weather-images/raining_after_all.jpg",
  "When Morning Glory Falls":"./ASSETS/weather-images/morning_glory_falls.jpg"
};


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
  const desc = weatherDesc[condition] || "It's Raining After All";
  document.querySelector(".condition").innerHTML = desc;
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
  // BG changes
if (weatherBgs[desc]) {
    weatherBg.style.backgroundImage = `url('${weatherBgs[desc]}')`;
  }
}