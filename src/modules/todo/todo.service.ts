import { pool } from "../../config/db";

const createTodoService = async (payload: Record<string, unknown>) => {

  const {user_id, title}  = payload;
  const result = await pool.query(
    `INSERT INTO todos(user_id, title) 
      VALUES($1, $2) returning *`,
    [user_id, title]
  );

  return result
};

export const todoServices = {
  createTodoService,
};
