import { Router } from "express";
import * as TC from "../controllers/tarefaController";

export const tarefaRoutes = Router();

// ======================
// API JSON
// ======================

tarefaRoutes.get("/api/tarefas", TC.listar);

tarefaRoutes.get("/api/tarefas/:id", TC.buscarPorId);

tarefaRoutes.post("/api/tarefas", TC.criar);

tarefaRoutes.put("/api/tarefas/:id", TC.atualizar);

tarefaRoutes.delete("/api/tarefas/:id", TC.remover);

// ======================
// PÁGINAS EJS
// ======================

tarefaRoutes.get("/tarefas", TC.listarPagina);

tarefaRoutes.get("/tarefas/cadastrar", TC.cadastrarPagina);

tarefaRoutes.post("/tarefas/cadastrar", TC.cadastrarForm);

tarefaRoutes.get("/tarefas/:id", TC.detalhePagina);

tarefaRoutes.post("/tarefas/:id/concluir", TC.concluirForm);

tarefaRoutes.post("/tarefas/:id/excluir", TC.excluirForm);