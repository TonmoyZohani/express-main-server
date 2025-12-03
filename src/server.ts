import express, { Request, Response } from "express";
import { initDB, pool } from "./config/db";
import logger from "./middleware/logger";
import { userRouter } from "./modules/user/user.routes";

const app = express();
const port = 5000;

initDB();

//parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", logger, (req: Request, res: Response) => {
  res.send("Hello Next Level Developers!");
});

// users crud operations

app.use("/users", userRouter);

// app.post("/users", async (req: Request, res: Response) => {
//   const { name, email, age, phone, address } = req.body;

//   try {
//     const result = await pool.query(
//       `INSERT INTO users (name, email, age, phone, address) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
//       [name, email, age, phone, address]
//     );

//     res.status(201).json({
//       success: true,
//       message: "Data Inserted Successfully",
//       data: result.rows[0],
//     });

//     // res.status(200).send({ message: "Data Inserted Successfully" });
//     console.log(req.body);
//   } catch (err: any) {
//     res.status(500).json({ success: false, mesage: err.message });
//   }
// });

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
