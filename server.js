// server.js

const express = require('express');
const app = express();
const artigosRouter = require('./src/api/artigos');
const artigosPopularesRouter = require('./src/api/artigosPopulares');
const artigosSearch = require('./src/api/artigosSearch');
const autoresRouter = require('./src/api/autores');

// Middleware para processar JSON
app.use(express.json());

// Usa a rota de artigos
app.use('/api/artigos', artigosRouter);
app.use('/api/artigos/populares', artigosPopularesRouter);
app.use('/api/artigos/search', artigosSearch);

// Usa a rota de autores
app.use('/api/autores', autoresRouter);

// Porta do servidor
const PORT = process.env.PORT || 3000;

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
