const express = require('express');
const router = express.Router();
const client = require('../database/database');

// Rota para consultar artigos por palavra-chave
router.get('/', async (req, res) => {
  try {
    const { keyword } = req.query;

    // Consulta CQL para recuperar artigos que contenham a palavra-chave especificada no conteúdo
    const query = 'SELECT * FROM facens.artigos WHERE TOKEN(conteudo) IN TOKEN(?)';

    // Executa a consulta, fornecendo a palavra-chave como parâmetro
    const result = await client.execute(query, [keyword], { prepare: true });

    // Retorna os resultados da consulta
    res.json(result.rows);
  } catch (error) {
    console.error('Erro:', error);
    res.status(500).json({ error: 'Erro ao consultar artigos por palavra-chave' });
  }
});

module.exports = router;
