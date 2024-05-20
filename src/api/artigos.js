const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const client = require("../database/database");

// Rota para pegar todos os artigos
router.get("/", async (req, res) => {
  try {
    // Consulta CQL para selecionar todos os artigos
    const query = "SELECT * FROM facens.artigos";

    // Executa a consulta
    const result = await client.execute(query);

    // Retorna os artigos como resposta
    res.json(result.rows);
  } catch (error) {
    console.error("Erro:", error);
    res.status(500).json({ error: "Erro ao buscar artigos" });
  }
});

// Rota para buscar todos os artigos em uma categoria específica
router.get("/categoria/:categoria", async (req, res) => {
  try {
    const category = req.params.categoria;

    // Consulta CQL para selecionar os artigos na categoria específica
    const query =
      "SELECT * FROM facens.artigos WHERE categoria = ? ALLOW FILTERING";

    // Executa a consulta passando a categoria como parâmetro
    const result = await client.execute(query, [category]);

    // Retorna os artigos encontrados como resposta
    res.json(result.rows);
  } catch (error) {
    console.error("Erro:", error);
    res.status(500).json({ error: "Erro ao buscar artigos na categoria" });
  }
});

module.exports = router;

// Rota para salvar um novo artigo
router.post("/", async (req, res) => {
  try {
    const { autor_id, titulo, categoria, conteudo, tags, visualizacoes } =
      req.body;

    // Verificar se o autor existe
    const autorQuery = "SELECT * FROM facens.autores WHERE autor_id = ?";
    const autorResult = await client.execute(autorQuery, [autor_id], {
      prepare: true,
    });

    if (autorResult.rowLength === 0) {
      return res.status(404).json({ error: "Autor não encontrado" });
    }

    // Gera um novo UUID para o artigo
    const id = uuidv4();

    // Define a data de publicação como a data e hora atuais
    const data_publicacao = new Date();

    // Consulta CQL para inserir um novo artigo
    const artigoQuery =
      "INSERT INTO facens.artigos (autor_id, id, titulo, categoria, conteudo, data_publicacao, tags, visualizacoes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    const params = [
      autor_id,
      id,
      titulo,
      categoria,
      conteudo,
      data_publicacao,
      tags,
      visualizacoes,
    ];

    // Executa a consulta
    await client.execute(artigoQuery, params, { prepare: true });

    // Retorna uma mensagem de sucesso
    res.status(201).json({ message: "Artigo salvo com sucesso!" });
  } catch (error) {
    console.error("Erro:", error);
    res.status(500).json({ error: "Erro ao salvar artigo" });
  }
});

// Rota para atualizar um artigo existente
router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    // Verificar se o artigo existe
    const checkQuery = "SELECT id FROM facens.artigos WHERE id = ?";
    const checkResult = await client.execute(checkQuery, [id], {
      prepare: true,
    });

    if (checkResult.rowLength === 0) {
      return res.status(404).json({ error: "Artigo não encontrado" });
    }

    // Parâmetros para a atualização
    const { titulo, categoria, conteudo, tags } = req.body;

    // Consulta CQL para atualizar o artigo
    const updateQuery =
      "UPDATE facens.artigos SET titulo = ?, categoria = ? conteudo = ?, tags = ? WHERE id = ?";
    const params = [titulo, categoria, conteudo, tags, id];

    // Executa a consulta de atualização
    await client.execute(updateQuery, params, { prepare: true });

    // Retorna uma mensagem de sucesso
    res.json({ message: "Artigo atualizado com sucesso!" });
  } catch (error) {
    console.error("Erro:", error);
    res.status(500).json({ error: "Erro ao atualizar artigo" });
  }
});

// Rota para excluir um artigo existente
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    // Consulta CQL para excluir o artigo
    const deleteQuery = "DELETE FROM facens.artigos WHERE id = ?";
    const params = [id];

    // Executa a consulta de exclusão
    await client.execute(deleteQuery, params, { prepare: true });

    // Retorna uma mensagem de sucesso
    res.json({ message: "Artigo excluído com sucesso!" });
  } catch (error) {
    console.error("Erro:", error);
    res.status(500).json({ error: "Erro ao excluir artigo" });
  }
});

module.exports = router;
