import { Request, Response } from "express";
import { todoServices } from "./todo.service";

const crateTodo = async (req: Request, res: Response) => {
  try {
    const result = await todoServices.createTodoService(req.body);
    res.status(200).json({
      success: true,
      message: "data inserted",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const todoControllers = {
  crateTodo,
};
