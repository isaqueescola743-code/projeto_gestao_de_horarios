async function carregarDados() {
    try {
        const res = await fetch('/api/dados');
        const data = await res.json();
        preencherListas(data);
        preencherTabela(data);
    } catch (err) {
        console.error('Erro ao carregar dados:', err);
    }
}

function preencherListas(data) {
    const selectTurma = document.getElementById('select-turma');
    const selectDisciplina = document.getElementById('select-disciplina');
    const selectProfessor = document.getElementById('select-professor');

    selectTurma.innerHTML = '';
    selectDisciplina.innerHTML = '';
    selectProfessor.innerHTML = '<option value="">Selecione um Professor</option>';

    data.turmas.forEach(t => {
        selectTurma.innerHTML += `<option value="${t.id}">${t.nome}</option>`;
    });

    data.disciplinas.forEach(d => {
        selectDisciplina.innerHTML += `<option value="${d.id}">${d.nome}</option>`;
    });

    data.professores.forEach(p => {
        selectProfessor.innerHTML += `<option value="${p.id}">${p.nome}</option>`;
    });
}

function preencherTabela(data) {
    const tbody = document.querySelector('#tabela-horarios tbody');
    tbody.innerHTML = '';

    const horas = ['08:00-09:00', '09:00-10:00', '10:00-11:00', '11:00-12:00'];
    const dias = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];

    horas.forEach(hora => {
        const tr = document.createElement('tr');
        tr.innerHTML = `<td>${hora}</td>`;

        dias.forEach(dia => {
            const td = document.createElement('td');
            // Formata a hora para comparar com o banco (HH:mm:ss)
            const horaInicioFoco = hora.split('-')[0] + ':00';
            
            const aula = data.horarios.find(a => a.hora_inicio === horaInicioFoco && a.dia_semana === dia);

            if (aula) {
                const disc = data.disciplinas.find(d => d.id === aula.disciplina_id);
                const prof = data.professores.find(p => p.id === aula.professor_id);
                const turm = data.turmas.find(t => t.id === aula.turma_id);
                td.innerHTML = `<strong>${disc.nome}</strong><br>${prof.nome}<br><small>${turm.nome}</small>`;
                td.classList.add('tem-aula');
            }
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });
}

document.getElementById('form-aula').addEventListener('submit', async (e) => {
    e.preventDefault();
    const dados = {
        turmaId: document.getElementById('select-turma').value,
        disciplinaId: document.getElementById('select-disciplina').value,
        professorId: document.getElementById('select-professor').value,
        dia: document.getElementById('select-dia').value,
        hora: document.getElementById('select-hora').value
    };

    const res = await fetch('/api/adicionar-aula', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
    });

    const result = await res.json();
    alert(result.mensagem);
    if (res.ok) carregarDados();
});

carregarDados();