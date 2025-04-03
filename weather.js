document.querySelector('#search').addEventListener('submit', async (event) => {
    event.preventDefault();

    const cityName = document.querySelector('#city_name').value;

    if (!cityName) {
        document.querySelector("#weather").classList.remove('show');
        showAlert('Você precisa digitar uma cidade...');
        return;
    }

    const apiKey = '8a60b2de14f7a17c7a11706b2cfcd87c';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURI(cityName)}&appid=${apiKey}&units=metric&lang=pt_br`;

    try {
        const results = await fetch(apiUrl);
        const json = await results.json();

        if (json.cod === 200) {
            showInfo({
                city: json.name,
                country: json.sys.country,
                temp: json.main.temp,
                tempMax: json.main.temp_max,
                tempMin: json.main.temp_min,
                description: json.weather[0].description,
                tempIcon: json.weather[0].icon,
                windSpeed: json.wind.speed,
                humidity: json.main.humidity,
            });
        } else {
            document.querySelector("#weather").classList.remove('show');
            showAlert('Não foi possível localizar a cidade...');
        }
    } catch (error) {
        console.error('Erro ao buscar os dados da API:', error);
        showAlert('Erro ao buscar os dados. Tente novamente mais tarde.');
    }
});

function showInfo(json) {
    document.querySelector("#weather").classList.add('show');
    document.querySelector('#title').innerHTML = `${json.city}, ${json.country}`;
    document.querySelector('#temp_value').innerHTML = `${json.temp.toFixed(1)} <sup>C°</sup>`;
    document.querySelector('#temp_description').innerHTML = `${json.description}`;

    // Verifique se o ícone está disponível e construa o URL
    const iconUrl = `https://openweathermap.org/img/wn/${json.tempIcon || '01d'}@2x.png`;
    document.querySelector('#temp_img').setAttribute('src', iconUrl);
    document.querySelector('#temp_img').setAttribute('alt', json.description);

    document.querySelector('#temp_max').innerHTML = `${json.tempMax.toFixed(1)} <sup>C°</sup>`;
    document.querySelector('#temp_min').innerHTML = `${json.tempMin.toFixed(1)} <sup>C°</sup>`;
    document.querySelector('#humidity').innerHTML = `${json.humidity}%`;
    document.querySelector('#wind').innerHTML = `${json.windSpeed.toFixed(1)} km/h`;

    console.log('Ícone carregado:', iconUrl); // Log para depuração
}

function showAlert(msg) {
    document.querySelector('#alert').innerHTML = msg;
}<div id="other_infos">
    <div class="info">
        <i id="temp_max_icon" class="fa-solid fa-temperature-high"></i>
        <div>
            <h2>Temp. max</h2>
            <p id="temp_max">32 <sup>C°</sup></p>
        </div>
    </div>

    <div class="info">
        <i id="temp_min_icon" class="fa-solid fa-temperature-low"></i>
        <div>
            <h2>Temp. min</h2>
            <p id="temp_min">12 <sup>C°</sup></p>
        </div>
    </div>

    <div class="info">
        <i id="humidity_icon" class="fa-solid fa-droplet"></i>
        <div>
            <h2>Humidade</h2>
            <p id="humidity">50%</p>
        </div>
    </div>

    <div class="info">
        <i id="wind_icon" class="fa-solid fa-wind"></i>
        <div>
            <h2>Vento</h2>
            <p id="wind">50 km/h</p>
        </div>
    </div>
</div>
