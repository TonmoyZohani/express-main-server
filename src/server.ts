import express, { NextFunction, Request, Response } from "express";
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
  await pool.query(`
        CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        age INT,
        phone VARCHAR(15),
        address TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
        )
        `);

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

// logger middleware
const logger = (req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}\n`);
  next();
};

//parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send("This is a get request test");
});

// users crud operations
app.post("/users", async (req: Request, res: Response) => {
  const { name, email, age, phone, address } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO users (name, email, age, phone, address) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [name, email, age, phone, address]
    );

    res.status(201).json({
      success: true,
      message: "Data Inserted Successfully",
      data: result.rows[0],
    });

    // res.status(200).send({ message: "Data Inserted Successfully" });
    console.log(req.body);
  } catch (err: any) {
    res.status(500).json({ success: false, mesage: err.message });
  }
});

app.get("/users", async (req: Request, res: Response) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.status(200).json({
      success: true,
      message: "Users Retrieved Successfully",
      data: result.rows,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, mesage: err.message });
  }
});

app.get("/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      res.status(404).json({ success: false, message: "User Not Found" });
      return;
    } else {
      res.status(200).json({
        success: true,
        message: "User Retrieved Successfully",
        data: result.rows[0],
      });
    }
  } catch (err: any) {
    res.status(500).json({ success: false, mesage: err.message });
  }
});

app.put("/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email, age, phone, address } = req.body;

  try {
    const result = await pool.query(
      `UPDATE users SET name = $1, email = $2, age = $3, phone = $4, address = $5 WHERE id = $6 RETURNING *`,
      [name, email, age, phone, address, id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ success: false, message: "User Not Found" });
      return;
    } else {
      res.status(200).json({
        success: true,
        message: "User Updated Successfully",
        data: result.rows[0],
      });
    }
  } catch (err: any) {
    res.status(500).json({ success: false, mesage: err.message });
  }
});

app.delete("/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await pool.query(`DELETE FROM users WHERE id = $1`, [id]);

    if (result.rowCount === 0) {
      res.status(404).json({ success: false, message: "User Not Found" });
      return;
    } else {
      res.status(200).json({
        success: true,
        message: "User Deleted Successfully",
        data: result.rows[0],
      });
    }
  } catch (err: any) {
    res.status(500).json({ success: false, mesage: err.message });
  }
});

//todos crud operations
app.post("/todos", async (req: Request, res: Response) => {
  const { user_id, title } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO todos(user_id, title) VALUES($1, $2) RETURNING *`,
      [user_id, title]
    );
    res.status(201).json({
      success: true,
      message: "Todo created",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

app.get("/todos", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`SELECT * FROM todos`);

    res.status(200).json({
      success: true,
      message: "todos retrieved successfully",
      data: result.rows,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
      datails: err,
    });
  }
});

// Get single todo
app.get("/todos/:id", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM todos WHERE id = $1", [
      req.params.id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch todo" });
  }
});

// Update todo
app.put("/todos/:id", async (req, res) => {
  const { title, completed } = req.body;

  try {
    const result = await pool.query(
      "UPDATE todos SET title=$1, completed=$2 WHERE id=$3 RETURNING *",
      [title, completed, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to update todo" });
  }
});

// Delete todo
app.delete("/todos/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM todos WHERE id=$1 RETURNING *",
      [req.params.id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.json({ success: true, message: "Todo deleted", data: null });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to delete todo" });
  }
});


app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.path,
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
