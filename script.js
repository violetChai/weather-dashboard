async function getWeather() {

  const city = document.getElementById("cityInput").value;

  const apiKey = "YOUR_API_KEY";

  const url =
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

  const response = await fetch(url);
  const data = await response.json();

  const result = document.getElementById("weatherResult");

  if (data.main) {

    result.innerHTML = `
      <h2>${data.name}</h2>
      <p>Temperature: ${data.main.temp} °C</p>
      <p>Weather: ${data.weather[0].description}</p>
    `;

  } else {

    result.innerHTML = `<p>City not found</p>`;

  }
}
