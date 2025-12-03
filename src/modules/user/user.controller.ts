import { Request, Response } from "express";
import { userServices } from "./user.service";

const createUser = async (req: Request, res: Response) => {
  const { name, email, age, phone, address } = req.body;

  try {
    const result = await userServices.createUser(
      name,
      email,
      age,
      phone,
      address
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
};

export const userControllers = {
  createUser,
};
