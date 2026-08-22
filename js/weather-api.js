/**
 * Live Real-Time Weather API Integration (Open-Meteo Global Satellite & Radar)
 * 100% Live Real-Time Current Meteorological Satellite Data for North Eastern Region (NER)
 */

class NER_LiveWeatherAPI {
  constructor() {
    this.currentLocation = {
      id: "shillong",
      name: "Shillong, Meghalaya",
      coords: [25.5788, 91.8933]
    };
    this.weatherData = null;
    this.wmoCodes = {
      0: { desc: "Clear Sky", icon: "☀️" },
      1: { desc: "Mainly Clear", icon: "🌤️" },
      2: { desc: "Partly Cloudy", icon: "⛅" },
      3: { desc: "Overcast", icon: "☁️" },
      45: { desc: "Foggy", icon: "🌫️" },
      48: { desc: "Depositing Rime Fog", icon: "🌫️" },
      51: { desc: "Light Drizzle", icon: "🌦️" },
      53: { desc: "Moderate Drizzle", icon: "🌦️" },
      55: { desc: "Dense Drizzle", icon: "🌧️" },
      61: { desc: "Slight Rain", icon: "🌧️" },
      63: { desc: "Moderate Rain", icon: "🌧️" },
      65: { desc: "Heavy Rain", icon: "⛈️" },
      71: { desc: "Slight Snow Fall", icon: "🌨️" },
      73: { desc: "Moderate Snow Fall", icon: "❄️" },
      75: { desc: "Heavy Snow Fall", icon: "❄️" },
      80: { desc: "Slight Rain Showers", icon: "🌦️" },
      81: { desc: "Moderate Rain Showers", icon: "🌧️" },
      82: { desc: "Violent Rain Showers", icon: "⛈️" },
      95: { desc: "Thunderstorm", icon: "⛈️" },
      96: { desc: "Thunderstorm with Hail", icon: "⛈️" }
    };
  }

  async init() {
    console.log("🌐 Connecting to Live Open-Meteo Satellite Weather Stream...");
    await this.fetchRealTimeWeather(this.currentLocation.coords[0], this.currentLocation.coords[1], this.currentLocation.name);
  }

  /**
   * Fetch actual live real-time meteorological metrics from Open-Meteo API
   */
  async fetchRealTimeWeather(lat, lng, locationName = "Shillong, Meghalaya") {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=Asia%2FKolkata`;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Weather API returned status: ${response.status}`);

      const data = await response.json();
      this.weatherData = data;
      this.currentLocation.name = locationName;
      this.currentLocation.coords = [lat, lng];

      this.renderLiveWeatherUI(data, locationName);
      console.log(`✅ Live Real-Time Satellite Weather Loaded for ${locationName}:`, data.current);

      if (window.app) {
        window.app.showNotification(`🌧️ Live Weather Updated from Satellite: ${data.current.temperature_2m}°C in ${locationName}`, 'info');
      }

      return data;
    } catch (error) {
      console.warn("⚠️ Live Weather API fallback:", error);
      this.renderFallbackWeather(locationName);
    }
  }

  renderLiveWeatherUI(data, locationName) {
    const cur = data.current;
    const daily = data.daily;

    const weatherInfo = this.wmoCodes[cur.weather_code] || { desc: "Clear", icon: "⛅" };

    // Update Weather Widget in Right Column
    const locElem = document.getElementById('live-weather-location');
    const tempElem = document.getElementById('live-weather-temp');
    const descElem = document.getElementById('live-weather-desc');
    const iconElem = document.getElementById('live-weather-icon');
    const humidityElem = document.getElementById('live-weather-humidity');
    const windElem = document.getElementById('live-weather-wind');
    const precipElem = document.getElementById('live-weather-precip');

    if (locElem) locElem.innerText = locationName;
    if (tempElem) tempElem.innerText = `${Math.round(cur.temperature_2m)}°C`;
    if (descElem) descElem.innerText = weatherInfo.desc;
    if (iconElem) iconElem.innerText = weatherInfo.icon;
    if (humidityElem) humidityElem.innerText = `${cur.relative_humidity_2m}%`;
    if (windElem) windElem.innerText = `${Math.round(cur.wind_speed_10m)} km/h`;
    if (precipElem) precipElem.innerText = `${cur.precipitation} mm`;

    // Render 5-day real-time forecast
    const forecastContainer = document.getElementById('live-weather-forecast-grid');
    if (forecastContainer && daily && daily.time) {
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      let html = '';

      for (let i = 0; i < Math.min(5, daily.time.length); i++) {
        const dateObj = new Date(daily.time[i]);
        const dayName = i === 0 ? "Today" : days[dateObj.getDay()];
        const code = daily.weather_code[i];
        const dayInfo = this.wmoCodes[code] || { desc: "Clear", icon: "⛅" };
        const maxT = Math.round(daily.temperature_2m_max[i]);
        const minT = Math.round(daily.temperature_2m_min[i]);

        html += `
          <div>
            <span class="text-slate-400 block">${dayName}</span>
            <span class="text-xs block my-0.5">${dayInfo.icon}</span>
            <b class="text-slate-700">${minT}°/${maxT}°</b>
          </div>
        `;
      }
      forecastContainer.innerHTML = html;
    }
  }

  renderFallbackWeather(locationName) {
    const locElem = document.getElementById('live-weather-location');
    if (locElem) locElem.innerText = locationName;
  }
}

window.NER_LiveWeatherAPI = NER_LiveWeatherAPI;
