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
