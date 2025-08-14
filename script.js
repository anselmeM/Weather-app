// API key for accessing the Visual Crossing Weather API
const apiKey = 'MSZFX378W9LM39D466F5WW32R';

// DOM element references
const cityInput = document.getElementById('cityInput');
const getWeatherButton = document.getElementById('getWeather');
const loadingIndicator = document.getElementById('loading');
const weatherDataDisplay = document.getElementById('weatherData');
const errorDisplay = document.getElementById('error');
const cityName = document.getElementById('cityName');
const temperature = document.getElementById('temperature');
const condition = document.getElementById('condition');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('windSpeed');
const weatherIcon = document.getElementById('weatherIcon');

// Fetches weather data from the API
async function fetchWeatherData(city, apiKey) {
  const baseUrl = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/';
  const url = `${baseUrl}${city}?unitGroup=us&key=${apiKey}&contentType=json`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
}

// Updates the UI with weather data
function updateWeatherUI(data) {
  cityName.textContent = data.resolvedAddress;
  temperature.textContent = `${data.currentConditions.temp}°F`;
  condition.textContent = data.currentConditions.conditions;
  humidity.textContent = `${data.currentConditions.humidity}%`;
  windSpeed.textContent = `${data.currentConditions.windspeed} mph`;

  const weatherCondition = data.currentConditions.icon.toLowerCase();
  if (weatherCondition.includes('rain')) {
    weatherIcon.src = 'img/—Pngtree—cartoon rain icon download_4441280.png';
  } else {
    weatherIcon.src = 'img/weather-app.png';
  }
  weatherIcon.alt = data.currentConditions.conditions;

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

// Main function to get weather
async function getWeather() {
  const city = cityInput.value;
  if (!city) {
    errorDisplay.textContent = 'Please enter a city name.';
    return;
  }

  loadingIndicator.style.display = 'block';
  weatherDataDisplay.style.display = 'none';
  errorDisplay.textContent = '';

  try {
    const data = await fetchWeatherData(city, apiKey);
    updateWeatherUI(data);
  } catch (error) {
    handleFetchError(error);
  }
}

// Event listeners
getWeatherButton.addEventListener('click', getWeather);
cityInput.addEventListener('keyup', (event) => {
  if (event.key === 'Enter') {
    getWeather();
  }
});