import express, { Request, Response } from "express";
import { Pool } from "pg";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const app = express();
const port = 5000;

const pool = new Pool({
  connectionString: process.env.CONNECETION_STRING,
});

const initDB = async () => {
  await pool.query(`CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    age INT,
    phone VARCHAR(255), 
    address TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  )`);

  await pool.query(`
            CREATE TABLE IF NOT EXISTS todos(
            id SERIAL PRIMARY KEY,
            user_id INT REFERENCES users(id) ON DELETE CASCADE,
            title VARCHAR(200) NOT NULL,
            description TEXT,
            completed BOOLEAN DEFAULT false,
            due_date DATE,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
            )
            `);
};

initDB();

//parser
app.use(express.json());
app.use(express.urlencoded());

app.get("/", (req: Request, res: Response) => {
  res.send("This is a get request test");
});

app.post("/users", async (req: Request, res: Response) => {
  const { name, email, age, phone, address } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO users (name, email, age, phone, address) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [name, email, age, phone, address]
    );
    res.status(200).send({ message: "Data Inserted Successfully" });
    console.log(req.body);
  } catch (err: any) {
    res.status(500).json({ success: false, mesage: err.message });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
