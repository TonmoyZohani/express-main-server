import { Router } from "express";
import { todoController } from "./todo.controller";

const todoRouter = Router();

todoRouter.post("/", todoController.createTodo);
todoRouter.get("/", todoController.getTodos);
todoRouter.get("/:id", todoController.getSingleTodo);
todoRouter.put("/:id", todoController.updateTodo);
todoRouter.delete("/:id", todoController.deleteTodo);

export const todoRoutes = todoRouter;
