import { pool } from "../../config/db";

const createUser = async (
  name: string,
  email: string,
  age: number,
  phone: string,
  address: string
) => {
  const result = await pool.query(
    `INSERT INTO users (name, email, age, phone, address) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [name, email, age, phone, address]
  );

  return result;
};

export const userServices = {
  createUser,
};
