// src/controllers/tarefaController.ts

import { Request, Response } from "express";
import * as TarefaModel from "../models/tarefaModel";
import { ApiResponse, Tarefa, FiltroQuery } from "../interfaces";

// LISTAR
export async function listar(
  req: Request<{}, {}, {}, FiltroQuery>,
  res: Response
) {
  try {
    let tarefas = await TarefaModel.listarTodas();

    if (req.query.concluida === "true") {
      tarefas = tarefas.filter((t) => t.concluida);
    }

    if (req.query.concluida === "false") {
      tarefas = tarefas.filter((t) => !t.concluida);
    }

    if (req.query.prioridade) {
      tarefas = tarefas.filter(
        (t) => t.prioridade === req.query.prioridade
      );
    }

    res.json({
      sucesso: true,
      dados: tarefas,
    } as ApiResponse<Tarefa[]>);

  } catch {
    res.status(500).json({
      sucesso: false,
      erro: "Erro interno",
    });
  }
}

// BUSCAR POR ID
export async function buscarPorId(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    const tarefa = await TarefaModel.buscarPorId(id);

    if (!tarefa) {
      res.status(404).json({
        sucesso: false,
        erro: "Tarefa não encontrada",
      });
      return;
    }

    res.json({
      sucesso: true,
      dados: tarefa,
    });

  } catch {
    res.status(500).json({
      sucesso: false,
      erro: "Erro interno",
    });
  }
}

// CRIAR
export async function criar(req: Request, res: Response) {
  try {
    const { titulo, descricao, prioridade } = req.body;

    const erros: string[] = [];

    if (!titulo || typeof titulo !== "string") {
      erros.push("titulo é obrigatório");
    }

    if (!["alta", "media", "baixa"].includes(prioridade)) {
      erros.push("prioridade inválida");
    }

    if (erros.length > 0) {
      res.status(400).json({
        sucesso: false,
        erros,
      });
      return;
    }

    const nova = await TarefaModel.criar({
      titulo,
      descricao,
      prioridade,
    });

    res.status(201).json({
      sucesso: true,
      dados: nova,
    });

  } catch {
    res.status(500).json({
      sucesso: false,
      erro: "Erro interno",
    });
  }
}

// ATUALIZAR
export async function atualizar(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    const atualizada = await TarefaModel.atualizar(id, req.body);

    if (!atualizada) {
      res.status(404).json({
        sucesso: false,
        erro: "Tarefa não encontrada",
      });
      return;
    }

    res.json({
      sucesso: true,
      dados: atualizada,
    });

  } catch {
    res.status(500).json({
      sucesso: false,
      erro: "Erro interno",
    });
  }
}

// REMOVER
export async function remover(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    const removida = await TarefaModel.remover(id);

    if (!removida) {
      res.status(404).json({
        sucesso: false,
        erro: "Tarefa não encontrada",
      });
      return;
    }

    res.json({
      sucesso: true,
      mensagem: "Tarefa removida com sucesso",
    });

  } catch {
    res.status(500).json({
      sucesso: false,
      erro: "Erro interno",
    });
  }
}

// =========================
// PÁGINAS EJS
// =========================

// LISTAR PÁGINA
export async function listarPagina(req: Request, res: Response) {
  try {
    const tarefas = await TarefaModel.listarTodas();

    res.render("tarefas", {
      tarefas,
    });

  } catch {
    res.status(500).send("Erro interno");
  }
}

// DETALHE DA TAREFA
export async function detalhePagina(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    const tarefa = await TarefaModel.buscarPorId(id);

    if (!tarefa) {
      res.status(404).send("Tarefa não encontrada");
      return;
    }

    res.render("detalhe", {
      tarefa,
    });

  } catch {
    res.status(500).send("Erro interno");
  }
}

// PÁGINA DE CADASTRO
export async function cadastrarPagina(req: Request, res: Response) {
  try {
    res.render("cadastrar");

  } catch {
    res.status(500).send("Erro interno");
  }
}

// PROCESSAR FORMULÁRIO DE CADASTRO
export async function cadastrarForm(req: Request, res: Response) {
  try {
    const { titulo, descricao, prioridade } = req.body;

    const nova = await TarefaModel.criar({
      titulo,
      descricao,
      prioridade,
    });

    // redireciona para detalhes
    res.redirect(`/tarefas/${nova.id}`);

  } catch {
    res.status(500).send("Erro interno");
  }
}

// CONCLUIR / DESCONCLUIR TAREFA
export async function concluirForm(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    const tarefa = await TarefaModel.buscarPorId(id);

    if (!tarefa) {
      res.status(404).send("Tarefa não encontrada");
      return;
    }

    await TarefaModel.atualizar(id, {
      concluida: !tarefa.concluida,
    });

    res.redirect("/tarefas");

  } catch {
    res.status(500).send("Erro interno");
  }
}

// EXCLUIR TAREFA
export async function excluirForm(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    await TarefaModel.remover(id);

    res.redirect("/tarefas");

  } catch {
    res.status(500).send("Erro interno");
  }
}