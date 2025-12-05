import { pool } from "../../config/db";

const createTodo = async (payload: Record<string, any>) => {
  const { user_id, title, completed } = payload;
  const result = await pool.query(
    `INSERT INTO todos(user_id, title,completed) VALUES($1, $2, $3) RETURNING *`,
    [user_id, title, completed]
  );
  return result;
};

const getTodos = async () => {
  const result = await pool.query(`SELECT * FROM todos`);
  return result;
};

const getSingleTodo = async (id: string) => {
  const result = await pool.query(`SELECT * FROM todos WHERE id = $1`, [id]);
  return result;
};

const updateTodo = async (payload: Record<string, any>) => {
  const { id, title, completed } = payload;
  const result = await pool.query(
    `UPDATE todos SET title = $1, completed = $2 WHERE id = $3 RETURNING *`,
    [title, id, completed]
  );
  return result;
};

const deleteTodo = async (id: string) => {
  const result = await pool.query(
    `DELETE FROM todos WHERE id = $1 RETURNING *`,
    [id]
  );
  return result;
};

export const todoServices = {
  createTodo,
  getTodos,
  getSingleTodo,
  updateTodo,
  deleteTodo,
};
