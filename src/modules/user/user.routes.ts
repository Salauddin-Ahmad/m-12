import express, { Request, Response } from "express";
import { userControllers } from "./user.controller";
import auth from "../../middleware/auth";

const router = express.Router();

router.post("/", userControllers.creatUser);
router.get("/", auth(), userControllers.getUser);

router.get("/:id", userControllers.getSingleUser);
router.put("/:id", userControllers.updateSingleUser);
router.delete("/:id", userControllers.deleteSingleUser);





export const userRoutes = router;
