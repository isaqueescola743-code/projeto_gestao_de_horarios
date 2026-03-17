const express = require('express');
const path = require('path');
const mysql = require('mysql2');

const app = express();
const PORT = 3000;

// Permite receber JSON do frontend
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

//conexaomysql
const db = mysql.createPool({
    host: 'localhost',
    user: 'nodeuser',       // usuário que você criou
    password: 'minhasenha', // senha que você escolheu
    database: 'escola'
});

// API para obter dados
app.get('/api/dados', (req, res) => {
    const dados = {};
    
    db.query('SELECT * FROM Professores', (err, professores) => {
        if (err) return res.status(500).json(err);
        dados.professores = professores;

        db.query('SELECT * FROM Turmas', (err, turmas) => {
            if (err) return res.status(500).json(err);
            dados.turmas = turmas;

            db.query('SELECT * FROM Disciplinas', (err, disciplinas) => {
                if (err) return res.status(500).json(err);
                dados.disciplinas = disciplinas;

                db.query('SELECT * FROM Horarios', (err, horarios) => {
                    if (err) return res.status(500).json(err);
                    dados.horarios = horarios;

                    res.json(dados);
                });
            });
        });
    });
});

// API para adicionar aula
app.post('/api/adicionar-aula', (req, res) => {
    const { turmaId, disciplinaId, dia, hora } = req.body;
    const [horaInicio, horaFim] = hora.split('-');

    // Checar se já existe aula nesse horário para a turma
    const sqlCheck = 'SELECT * FROM Horarios WHERE turma_id=? AND dia_semana=? AND hora_inicio=?';
    db.query(sqlCheck, [turmaId, dia, horaInicio], (err, results) => {
        if (err) return res.status(500).json(err);
        if (results.length > 0) {
            return res.status(400).json({ mensagem: "Essa turma já tem uma aula nesse horário!" });
        }

        // Buscar professor responsável pela disciplina
        db.query('SELECT professor_id FROM Disciplinas WHERE id=?', [disciplinaId], (err, result) => {
            if (err) return res.status(500).json(err);
            if (result.length === 0) return res.status(400).json({ mensagem: "Disciplina não encontrada!" });

            const professorId = result[0].professor_id;

            // Inserir a aula no banco
            const sqlInsert = 'INSERT INTO Horarios (turma_id, disciplina_id, professor_id, dia_semana, hora_inicio, hora_fim) VALUES (?, ?, ?, ?, ?, ?)';
            db.query(sqlInsert, [turmaId, disciplinaId, professorId, dia, horaInicio, horaFim], (err, result) => {
                if (err) return res.status(500).json(err);
                res.json({ mensagem: "Aula adicionada com sucesso!" });
            });
        });
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`✅ Servidor Node.js rodando em: http://localhost:${PORT}`);
});