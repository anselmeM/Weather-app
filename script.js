const apiKey = 'MSZFX378W9LM39D466F5WW32R'; // Using the API key provided by the user

async function getWeatherData(city, apiKey) {
  const loadingIndicator = document.getElementById('loading');
  const weatherDataDisplay = document.getElementById('weatherData');
  const errorDisplay = document.getElementById('error');
  const baseUrl = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/';
  const url = `${baseUrl}${city}?unitGroup=us&key=${apiKey}&contentType=json`;

  loadingIndicator.style.display = 'block';
  weatherDataDisplay.style.display = 'none';
  errorDisplay.textContent = '';

  try {
    const response = await fetch(url);
    if (!response.ok) {
      let message = 'Failed to fetch weather data';
      if (response.status === 400) {
        message = 'Bad request. Please check the city name.';
      } else if (response.status === 401) {
        message = 'Unauthorized. Invalid API key.';
      } else if (response.status === 404) {
        message = 'City not found.';
      } else if (response.status >= 500) {
        message = 'Server error while fetching weather data.';
      }
      errorDisplay.textContent = message;
      loadingIndicator.style.display = 'none';
      weatherDataDisplay.style.display = 'none';
      return;
    }
    const data = await response.json();
    const cityName = document.getElementById('cityName');
    const temperature = document.getElementById('temperature');
    const condition = document.getElementById('condition');
    const humidity = document.getElementById('humidity');
    const windSpeed = document.getElementById('windSpeed');
    const weatherIcon = document.getElementById('weatherIcon');

    cityName.textContent = data.resolvedAddress;
    temperature.textContent = `Temperature: ${data.currentConditions.temp}°F`;
    condition.textContent = `Condition: ${data.currentConditions.conditions}`;
    humidity.textContent = `Humidity: ${data.currentConditions.humidity}%`;
    windSpeed.textContent = `Wind Speed: ${data.currentConditions.windspeed} mph`;

    weatherIcon.src = 'img/—Pngtree—cartoon rain icon download_4441280.png';
    weatherIcon.alt = data.currentConditions.conditions;

    loadingIndicator.style.display = 'none';
    weatherDataDisplay.style.display = 'block';
    return data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    errorDisplay.textContent = 'Failed to fetch weather data.';
    loadingIndicator.style.display = 'none';
    weatherDataDisplay.style.display = 'none';
  }
}

document.getElementById('getWeather').addEventListener('click', () => {
  const cityInput = document.getElementById('cityInput');
  const city = cityInput.value;
  if (city) {
    getWeatherData(city, apiKey);
  } else {
    const errorDisplay = document.getElementById('error');
    errorDisplay.textContent = 'Please enter a city name.';
  }
});
