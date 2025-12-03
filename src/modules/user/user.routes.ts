import express from "express";
import { userControllers } from "./user.controller";

const router = express.Router();

router.post("/", userControllers.createUser);
router.get("/", userControllers.getUser);
router.get("/:id", userControllers.getUserById);

export const userRouter = router;
