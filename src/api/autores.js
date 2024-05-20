const express = require("express");
const router = express.Router();
const client = require("../database/database");

// Rota para pegar autores
router.get("/", async (req, res) => {
  try {
    let query = "SELECT * FROM facens.autores";

    const { id, nome } = req.query;

    // Se for fornecido um ID, adicionamos uma cláusula WHERE na consulta
    if (id) {
      query += " WHERE id = ? ALLOW FILTERING";
      const result = await client.execute(query, [id], { prepare: true });
      return res.json(result.rows);
    }

    // Se for fornecido um nome, adicionamos uma cláusula WHERE na consulta
    if (nome) {
      query += " WHERE nome = ? ALLOW FILTERING";
      const result = await client.execute(query, [nome], { prepare: true });
      return res.json(result.rows);
    }

    // Se nenhum parâmetro for fornecido, retornamos todos os autores
    const result = await client.execute(query);
    res.json(result.rows);
  } catch (error) {
    console.error("Erro:", error);
    res.status(500).json({ error: "Erro ao buscar autores" });
  } finally {
    // Não se esqueça de fechar a conexão após o uso
    await client.shutdown();
  }
});

// Rota para obter os IDs dos autores dos últimos 10 artigos publicados
router.get("/ultimos", async (req, res) => {
  try {
    // Consulta CQL para selecionar os últimos 10 artigos publicados da materialized view
    const queryArtigos =
      "SELECT autor_id FROM facens.artigos_by_data_publicacao LIMIT 10";

    // Executa a consulta para obter os artigos
    const resultArtigos = await client.execute(queryArtigos);

    if (resultArtigos.rowLength === 0) {
      return res.json([]);
    }

    // Extrair autor_id de cada artigo
    const autorIds = resultArtigos.rows.map((artigo) => artigo.autor_id);

    // Retornar os IDs dos autores como resposta
    res.json(autorIds);
  } catch (error) {
    console.error("Erro:", error);
    res
      .status(500)
      .json({ error: "Erro ao buscar IDs dos autores dos últimos artigos" });
  }
});

module.exports = router;

module.exports = router;

module.exports = router;
