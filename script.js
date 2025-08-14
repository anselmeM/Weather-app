// API key for accessing the Visual Crossing Weather API
const apiKey = 'MSZFX378W9LM39D466F5WW32R';
let currentUnit = 'us'; // 'us' for Fahrenheit, 'metric' for Celsius

// DOM element references
const cityInput = document.getElementById('cityInput');
const getWeatherButton = document.getElementById('getWeather');
const geolocationButton = document.getElementById('geolocationButton');
const loadingIndicator = document.getElementById('loading');
const weatherDataDisplay = document.getElementById('weatherData');
const errorDisplay = document.getElementById('error');
const cityName = document.getElementById('cityName');
const temperature = document.getElementById('temperature');
const condition = document.getElementById('condition');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('windSpeed');
const weatherIcon = document.getElementById('weatherIcon');
const unitToggleButton = document.getElementById('unitToggle');
const forecastContainer = document.getElementById('forecastContainer');

// Fetches weather data from the API
async function fetchWeatherData(city, apiKey) {
  const baseUrl = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/';
  const url = `${baseUrl}${city}?unitGroup=${currentUnit}&key=${apiKey}&contentType=json`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
}

// Updates the UI with forecast data
function updateForecastUI(days) {
  forecastContainer.innerHTML = ''; // Clear previous forecast
  // Slice to get the next 5 days, skipping today
  const forecastDays = days.slice(1, 6);

  forecastDays.forEach(day => {
    const dayDiv = document.createElement('div');
    dayDiv.className = 'forecast-day';

    const date = new Date(day.datetime);
    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' });

    const icon = document.createElement('img');
    const weatherCondition = day.icon.toLowerCase();
    if (weatherCondition.includes('rain')) {
      icon.src = 'img/—Pngtree—cartoon rain icon download_4441280.png';
    } else {
      icon.src = 'img/weather-app.png';
    }
    icon.alt = day.conditions;

    const tempMax = document.createElement('p');
    const tempMin = document.createElement('p');
    const tempUnit = currentUnit === 'us' ? '°F' : '°C';
    tempMax.textContent = `Max: ${day.tempmax}${tempUnit}`;
    tempMin.textContent = `Min: ${day.tempmin}${tempUnit}`;

    const dayLabel = document.createElement('p');
    dayLabel.textContent = dayOfWeek;

    dayDiv.appendChild(dayLabel);
    dayDiv.appendChild(icon);
    dayDiv.appendChild(tempMax);
    dayDiv.appendChild(tempMin);

    forecastContainer.appendChild(dayDiv);
  });
}

// Updates the UI with weather data
function updateWeatherUI(data) {
  cityName.textContent = data.resolvedAddress;
  const tempUnit = currentUnit === 'us' ? '°F' : '°C';
  const speedUnit = currentUnit === 'us' ? 'mph' : 'kph';
  temperature.textContent = `${data.currentConditions.temp}${tempUnit}`;
  condition.textContent = data.currentConditions.conditions;
  humidity.textContent = `${data.currentConditions.humidity}%`;
  windSpeed.textContent = `${data.currentConditions.windspeed} ${speedUnit}`;

  const weatherCondition = data.currentConditions.icon.toLowerCase();
  if (weatherCondition.includes('rain')) {
    weatherIcon.src = 'img/—Pngtree—cartoon rain icon download_4441280.png';
  } else {
    weatherIcon.src = 'img/weather-app.png';
  }
  weatherIcon.alt = data.currentConditions.conditions;

  updateForecastUI(data.days); // Update the forecast display

  loadingIndicator.style.display = 'none';
  weatherDataDisplay.style.display = 'block';
}

// Handles errors during the fetch process
function handleFetchError(error) {
  console.error('Error fetching weather data:', error);
  let message = 'Failed to fetch weather data.';
  if (error.message.includes('400')) {
    message = 'Bad request. Please check the city name.';
  } else if (error.message.includes('401')) {
    message = 'Unauthorized. Invalid API key.';
  } else if (error.message.includes('404')) {
    message = 'City not found.';
  } else if (error.message.includes('500')) {
    message = 'Server error while fetching weather data.';
  }
  errorDisplay.textContent = message;
  loadingIndicator.style.display = 'none';
  weatherDataDisplay.style.display = 'none';
}

let lastLocation = ''; // To store the last searched location

// Main function to get weather
async function getWeather(location = null) {
  const locationQuery = location || cityInput.value;
  if (!locationQuery) {
    errorDisplay.textContent = 'Please enter a city name or use geolocation.';
    return;
  }

  lastLocation = locationQuery; // Save the location for unit toggling

  loadingIndicator.style.display = 'block';
  weatherDataDisplay.style.display = 'none';
  errorDisplay.textContent = '';

  try {
    const data = await fetchWeatherData(locationQuery, apiKey);
    updateWeatherUI(data);
  } catch (error) {
    handleFetchError(error);
  }
}

// Toggles the unit and re-fetches weather data if a city is displayed
function toggleUnit() {
  currentUnit = currentUnit === 'us' ? 'metric' : 'us';
  unitToggleButton.textContent = currentUnit === 'us' ? '°F' : '°C';
  // If a city's weather is already displayed, fetch it again with the new unit
  if (weatherDataDisplay.style.display === 'block') {
    getWeather(lastLocation);
  }
}

// Gets weather for the user's current location
function getWeatherForCurrentLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        getWeather(`${latitude},${longitude}`);
      },
      (error) => {
        let message = 'Failed to get location.';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = 'Geolocation permission denied.';
            break;
          case error.POSITION_UNAVAILABLE:
            message = 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            message = 'Location request timed out.';
            break;
        }
        errorDisplay.textContent = message;
      }
    );
  } else {
    errorDisplay.textContent = 'Geolocation is not supported by this browser.';
  }
}

// Event listeners
getWeatherButton.addEventListener('click', () => getWeather());
geolocationButton.addEventListener('click', getWeatherForCurrentLocation);
cityInput.addEventListener('keyup', (event) => {
  if (event.key === 'Enter') {
    getWeather();
  }
});
unitToggleButton.addEventListener('click', toggleUnit);