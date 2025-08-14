// API key for accessing the Visual Crossing Weather API
const apiKey = 'MSZFX378W9LM39D466F5WW32R';
const UNIT_PREFERENCE_KEY = 'weatherAppUnitPreference';
let currentUnit = localStorage.getItem(UNIT_PREFERENCE_KEY) || 'us'; // Load preference or default to 'us'

// DOM element references
const cityInput = document.getElementById('cityInput');
const getWeatherButton = document.getElementById('getWeather');
const geolocationButton = document.getElementById('geolocationButton');
const searchForm = document.getElementById('searchForm');
const clearButton = document.getElementById('clearButton');
const cardElement = document.querySelector('.card');
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
const searchHistoryDatalist = document.getElementById('searchHistory');

// --- Search History ---
const SEARCH_HISTORY_KEY = 'weatherAppSearchHistory';
const MAX_HISTORY_ITEMS = 5;

function updateHistoryDatalist(history) {
  searchHistoryDatalist.innerHTML = '';
  history.forEach(city => {
    const option = document.createElement('option');
    option.value = city;
    searchHistoryDatalist.appendChild(option);
  });
}

function loadSearchHistory() {
  const history = JSON.parse(localStorage.getItem(SEARCH_HISTORY_KEY)) || [];
  updateHistoryDatalist(history);
}

function saveSearch(city) {
  let history = JSON.parse(localStorage.getItem(SEARCH_HISTORY_KEY)) || [];
  history = history.filter(item => item.toLowerCase() !== city.toLowerCase());
  history.unshift(city);
  if (history.length > MAX_HISTORY_ITEMS) {
    history = history.slice(0, MAX_HISTORY_ITEMS);
  }
  localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(history));
  updateHistoryDatalist(history);
}
// --- End Search History ---

// --- Icon Mapping ---
const iconMap = {
    'snow': 'wi-snow',
    'snow-showers-day': 'wi-day-snow',
    'snow-showers-night': 'wi-night-snow',
    'thunder-rain': 'wi-thunderstorm',
    'thunder-showers-day': 'wi-day-thunderstorm',
    'thunder-showers-night': 'wi-night-thunderstorm',
    'rain': 'wi-rain',
    'showers-day': 'wi-day-showers',
    'showers-night': 'wi-night-showers',
    'fog': 'wi-fog',
    'wind': 'wi-strong-wind',
    'cloudy': 'wi-cloudy',
    'partly-cloudy-day': 'wi-day-cloudy',
    'partly-cloudy-night': 'wi-night-alt-cloudy',
    'clear-day': 'wi-day-sunny',
    'clear-night': 'wi-night-clear',
};

function getIconClass(iconName) {
    return `wi ${iconMap[iconName] || 'wi-na'}`; // Return 'wi-na' (not available) as a fallback
}
// --- End Icon Mapping ---

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
  const forecastDays = days.slice(1, 6);

  forecastDays.forEach(day => {
    const dayDiv = document.createElement('div');
    dayDiv.className = 'forecast-day';

    const date = new Date(day.datetime);
    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' });

    const icon = document.createElement('i');
    icon.className = getIconClass(day.icon);
    icon.setAttribute('aria-hidden', 'true');

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

  weatherIcon.className = `weather-icon ${getIconClass(data.currentConditions.icon)}`;
  weatherIcon.setAttribute('aria-label', data.currentConditions.conditions);

  updateForecastUI(data.days);
  loadingIndicator.style.display = 'none';
  cardElement.classList.add('weather-visible');
  weatherDataDisplay.setAttribute('aria-busy', 'false');
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
  cardElement.classList.remove('weather-visible');
  weatherDataDisplay.setAttribute('aria-busy', 'false');
}

let lastLocation = '';

// Main function to get weather
async function getWeather(location = null) {
  const locationQuery = location || cityInput.value;
  if (!locationQuery) {
    errorDisplay.textContent = 'Please enter a city name or use geolocation.';
    return;
  }

  lastLocation = locationQuery;

  loadingIndicator.style.display = 'block';
  cardElement.classList.remove('weather-visible');
  weatherDataDisplay.setAttribute('aria-busy', 'true');
  errorDisplay.textContent = '';

  try {
    const data = await fetchWeatherData(locationQuery, apiKey);
    updateWeatherUI(data);
    if (!locationQuery.includes(',')) {
      saveSearch(locationQuery);
    }
  } catch (error) {
    handleFetchError(error);
  }
}

// Toggles the unit and re-fetches weather data if a city is displayed
function toggleUnit() {
  currentUnit = currentUnit === 'us' ? 'metric' : 'us';
  unitToggleButton.textContent = currentUnit === 'us' ? '°F' : '°C';
  localStorage.setItem(UNIT_PREFERENCE_KEY, currentUnit); // Save the preference
  if (cardElement.classList.contains('weather-visible')) {
    getWeather(lastLocation);
  }
}

// Sets the initial state of the unit toggle button
function initializeUnit() {
    unitToggleButton.textContent = currentUnit === 'us' ? '°F' : '°C';
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

// Clears the UI and resets the state
function clearUI() {
    cityInput.value = '';
    errorDisplay.textContent = '';
    lastLocation = '';
    cardElement.classList.remove('weather-visible');
}

// Event listeners
searchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  getWeather();
});
geolocationButton.addEventListener('click', getWeatherForCurrentLocation);
unitToggleButton.addEventListener('click', toggleUnit);
clearButton.addEventListener('click', clearUI);

// Initial Load
loadSearchHistory();
initializeUnit();