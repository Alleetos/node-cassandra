const express = require("express");
const router = express.Router();
const client = require("../database/database");

// Rota para buscar os artigos mais populares com base no número de visualizações
router.get("/", async (req, res) => {
  try {
    const limit = req.query.limit || 5;

    // Consulta CQL para selecionar os artigos mais populares
    const query =
      "SELECT * FROM facens.artigos ORDER BY visualizacoes DESC LIMIT ?";

    // Executa a consulta
    const result = await client.execute(query, [limit], { prepare: true });

    // Retorna os resultados como resposta
    res.json(result.rows);
  } catch (error) {
    console.error("Erro:", error);
    res.status(500).json({ error: "Erro ao buscar artigos populares" });
  }
});

module.exports = router;
