// Lista de Tarefas
const button = document.querySelector('.button-add-task');
const input = document.querySelector('.input-task');
const listaCompleta = document.querySelector('.list-tasks');

let minhaListaDeItens = [];

function adicionarNovaTarefa() {
    if (input.value.trim() === '') {
        alert('Por favor, insira uma tarefa válida.');
        return;
    }

    minhaListaDeItens.push({
        tarefa: input.value,
        descricao: '',
        concluida: false,
    });

    input.value = '';
    mostrarTarefas();
}

function mostrarTarefas() {
    let novaLi = '';

    minhaListaDeItens.forEach((item, posicao) => {
        novaLi += `
            <li class="task ${item.concluida ? 'done' : ''} ${item.descricao ? 'show-description' : ''}">
                <p>${item.tarefa}</p>
                <div class="description">${item.descricao}</div>
                <div class="actions">
                    <img src="/imgs/checked.png" alt="check-na-tarefa" onclick="concluirTarefa(${posicao}); event.stopPropagation()">
                    <img src="/imgs/trash.png" alt="tarefa-para-o-lixo" onclick="deletarItem(${posicao}); event.stopPropagation()">
                </div>
            </li>
        `;
    });

    listaCompleta.innerHTML = novaLi;
    localStorage.setItem('lista', JSON.stringify(minhaListaDeItens));
}

function toggleDescription(posicao) {
    const descricao = prompt('Adicione uma descrição para a tarefa:');
    if (descricao !== null) {
        minhaListaDeItens[posicao].descricao = descricao;
        mostrarTarefas();
    }
}

function concluirTarefa(posicao) {
    minhaListaDeItens[posicao].concluida = !minhaListaDeItens[posicao].concluida;
    mostrarTarefas();
}

function deletarItem(posicao) {
    minhaListaDeItens.splice(posicao, 1);
    mostrarTarefas();
}

function recarregarTarefas() {
    const tarefasDoLocalStorage = localStorage.getItem('lista');

    if (tarefasDoLocalStorage) {
        minhaListaDeItens = JSON.parse(tarefasDoLocalStorage);
    }

    mostrarTarefas();
}

recarregarTarefas();
button.addEventListener('click', adicionarNovaTarefa);

document.addEventListener('click', function (event) {
    const taskElement = event.target.closest('.task');
    if (taskElement && !event.target.closest('.actions')) {
        const index = Array.from(listaCompleta.children).indexOf(taskElement);
        toggleDescription(index);
    }
});

// Previsão do Tempo
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
        showAlert('Não foi possível localizar...');
    }
});

function showInfo(json) {
    document.querySelector("#weather").classList.add('show');
    document.querySelector('#title').innerHTML = `${json.city}, ${json.country}`;
    document.querySelector('#temp_value').innerHTML = `${json.temp.toFixed(1)} <sup>C°</sup>`;
    document.querySelector('#temp_description').innerHTML = `${json.description}`;
    document.querySelector('#temp_img').setAttribute('src', `https://openweathermap.org/img/wn/${json.tempIcon}@2x.png`);
    document.querySelector('#temp_max').innerHTML = `${json.tempMax.toFixed(1)} <sup>C°</sup>`;
    document.querySelector('#temp_min').innerHTML = `${json.tempMin.toFixed(1)} <sup>C°</sup>`;
    document.querySelector('#humidity').innerHTML = `${json.humidity}%`;
    document.querySelector('#wind').innerHTML = `${json.windSpeed.toFixed(1)} km/h`;
}

function showAlert(msg) {
    document.querySelector('#alert').innerHTML = msg;
}
