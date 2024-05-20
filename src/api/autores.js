const express = require('express');
const router = express.Router();
const client = require('../database/database');

// Rota para pegar autores
router.get('/', async (req, res) => {
  try {
    let query = 'SELECT * FROM facens.autores';

    const { id, nome } = req.query;

    // Se for fornecido um ID, adicionamos uma cláusula WHERE na consulta
    if (id) {
      query += ' WHERE id = ? ALLOW FILTERING';
      const result = await client.execute(query, [id], { prepare: true });
      return res.json(result.rows);
    }

    // Se for fornecido um nome, adicionamos uma cláusula WHERE na consulta
    if (nome) {
      query += ' WHERE nome = ? ALLOW FILTERING';
      const result = await client.execute(query, [nome], { prepare: true });
      return res.json(result.rows);
    }

    // Se nenhum parâmetro for fornecido, retornamos todos os autores
    const result = await client.execute(query);
    res.json(result.rows);
  } catch (error) {
    console.error('Erro:', error);
    res.status(500).json({ error: 'Erro ao buscar autores' });
  } finally {
    // Não se esqueça de fechar a conexão após o uso
    await client.shutdown();
  }
});


module.exports = router;
