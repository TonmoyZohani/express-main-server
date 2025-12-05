import { Request, Response } from "express";
import { userServices } from "./user.service";

const createUser = async (req: Request, res: Response) => {
  // const { name, email, age, phone, address } = req.body;
  try {
    const result = await userServices.createUser(req.body);
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

const getUser = async (req: Request, res: Response) => {
  try {
    const result = await userServices.getUser();
    res.status(200).json({
      success: true,
      message: "Users Retrieved Successfully",
      data: result.rows,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, mesage: err.message });
  }
};

const getUserById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await userServices.getUserById(id!);

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
};

const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email, age, phone, address } = req.body;

  try {
    const result = await userServices.updateUser(
      id!,
      name,
      email,
      age,
      phone,
      address
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
};

const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await userServices.deleteUser(id!);

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
};

export const userControllers = {
  createUser,
  getUser,
  getUserById,
  updateUser,
  deleteUser,
};
