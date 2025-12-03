import express, { Request, Response } from "express";
import { pool } from "../../config/db";

const router = express.Router();

router.post("/", async (req: Request, res: Response) => {
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

export const userRouter = router;
