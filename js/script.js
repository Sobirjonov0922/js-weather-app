let cityInput = document.querySelector('.weather-gap__city'),
  searchBtn = document.querySelector('.weather-gap__search'),
  currentLocationBtn = document.querySelector('.weather-gap__location'),
  weatherDataCurrent = document.querySelector('.weather-data__current'),
  weatherCards = document.querySelector('.weather-data__cards')

// API
const API_KEY = "42b065b03c537f34a2fcbadbd8b9fbb1"

const createWeatherCard = (cityName, weatherItem, idx) => {
  if (idx === 0) {
    return `
      <div class="weather-data__details">
        <h2 class="weather-data__heading">${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h2>
        <h4 class="weather-data__info">Temperature: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h4>
        <h4 class="weather-data__info">Wind: ${weatherItem.wind.speed} M/S</h4>
        <h4 class="weather-data__info">Humidity: ${weatherItem.main.humidity}%</h4>
      </div>
      <div class="weather-data__icon">
        <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="Weather" class="weather-data__img">
        <h4 class="weather-data__subtitle">${weatherItem.weather[0].description}</h4>
      </div>
    `
  } else {
    return `
      <li class="weather-data__card">
        <div class="weather-card">
          <h3 class="weather-data__heading">(${weatherItem.dt_txt.split(" ")[0]})</h3>
          <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="Weather" class="weather-data__card-img">
          <h4 class="weather-data__info">Temp: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h4>
          <h4 class="weather-data__info">Wind: ${weatherItem.wind.speed} M/S</h4>
          <h4 class="weather-data__info">Humidity: ${weatherItem.main.humidity}%</h4>
        </div>
      </li>
    `
  }
}

const getWeatherDetails = (cityName, lat, lon) => {
  const WEATHER_API_URL = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`

  fetch(WEATHER_API_URL)
    .then((res) => res.json())
    .then((data) => {
      const uniqueForecastDays = []

      const fiveDaysForecast = data.list.filter((forecast) => {
        const forecastDate = new Date(forecast.dt_txt).getDate()

        if (!uniqueForecastDays.includes(forecastDate)) {
          return uniqueForecastDays.push(forecastDate)
        }
      })

      cityInput.value = ''
      weatherDataCurrent.innerHTML = ''
      weatherCards.innerHTML = ''

      fiveDaysForecast.forEach((weatherItem, idx) => {
        const html = createWeatherCard(cityName, weatherItem, idx)
        if (idx === 0) {
          weatherDataCurrent.insertAdjacentHTML("beforeend", html)
        } else {
          weatherCards.insertAdjacentHTML("beforeend", html)
        }
      })
    })
    .catch(() => {
      alert("An error occurred while fetching the weather forecast!")
    })
}

const getCityCoordinates = () => {
  let cityName = cityInput.value.trim()

  if (cityName === "") return;

  const GEOCODING_API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`

  fetch(GEOCODING_API_URL)
    .then((res) => res.json())
    .then((data) => {
      if (!data.length) return alert(`No coordinates found for ${cityName}`)

      const { name, lat, lon } = data[0]
      getWeatherDetails(name, lat, lon)
    })
    .catch(() => {
      alert("An error occurred while fetching the coordinates!")
    })
}

const getUserCoordinates = () => {
  navigator.geolocation.getCurrentPosition((position) => {
    const { latitude, longitude } = position.coords
    const REVERSE_GEOCODING_URL = `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`

    fetch(REVERSE_GEOCODING_URL)
    .then((res) => res.json())
    .then((data) => {

      const { name } = data[0]
      getWeatherDetails(name, latitude, longitude)
    })
    .catch(() => {
      alert("An error occurred while fetching the city!")
    })
    
  }, (error) => {
    if (error.code === error.PERMISSION_DENIED) {
      alert("Geolocation request denied. Please reset location permission to grant access again")
    } else {
      alert("Geolocation request error. Please reset location permission.");
    }
  })
}

currentLocationBtn.addEventListener('click', getUserCoordinates)
searchBtn.addEventListener('click', getCityCoordinates)
cityInput.addEventListener('keyup', (e) => e.key === "Enter" && getCityCoordinates())
// API