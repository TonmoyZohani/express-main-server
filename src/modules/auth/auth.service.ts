import { pool } from "../../config/db";
import bcrypt from "bcryptjs";
import config from "../../config";
import jwt from "jsonwebtoken";

const loginUser = async (payload: Record<string, unknown>) => {
  const { email, password } = payload;

  const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [
    email,
  ]);

  if (result.rows.length === 0) {
    return { success: false, message: "Invalid Credentials" };
  }

  const user = result.rows[0];

  const match = await bcrypt.compare(password as string, user.password);

  if (!match) {
    return { success: false, message: "Invalid Credentials" };
  }

  const token = jwt.sign(
    { name: user.name, email: user.email, role: user.role },
    config.jwtSecret as string,
    { expiresIn: "7d" }
  );

  return {token, user};
};


export const authServices = {
  loginUser,
};