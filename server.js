const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Permite receber JSON do frontend
app.use(express.json());

// Pasta pública (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// "Banco de dados" em memória
let professores = [
    { id: 1, nome: "João" },
    { id: 2, nome: "Maria" }
];

let turmas = [
    { id: 1, nome: "10A" },
    { id: 2, nome: "10B" }
];

let disciplinas = [
    { id: 1, nome: "Matemática", professorId: 1 },
    { id: 2, nome: "Português", professorId: 2 },
    { id: 3, nome: "História", professorId: 2 }
];

let horarios = [
    { hora: "08:00-09:00", dia: "Segunda", turmaId: 1, disciplinaId: 1 },
    { hora: "09:00-10:00", dia: "Segunda", turmaId: 1, disciplinaId: 2 },
    { hora: "08:00-09:00", dia: "Terça", turmaId: 2, disciplinaId: 3 }
];

// API para obter dados
app.get('/api/dados', (req, res) => {
    res.json({ professores, turmas, disciplinas, horarios });
});

// API para adicionar aula
app.post('/api/adicionar-aula', (req, res) => {
    const { turmaId, disciplinaId, dia, hora } = req.body;

    const conflito = horarios.find(a => a.hora === hora && a.dia === dia && a.turmaId === turmaId);
    if (conflito) {
        return res.status(400).json({ mensagem: "Essa turma já tem uma aula nesse horário!" });
    }

    horarios.push({ turmaId, disciplinaId, dia, hora });
    res.json({ mensagem: "Aula adicionada com sucesso!" });
});

// Iniciar servidor com mensagem clara
app.listen(PORT, (err) => {
    if (err) {
        console.error("❌ Erro ao iniciar o servidor:", err);
    } else {
        console.log(`✅ Servidor Node.js rodando em: http://localhost:${PORT}`);
    }
});