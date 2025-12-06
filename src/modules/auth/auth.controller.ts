import { Request, Response } from "express";
import { authServices } from "./auth.service";

const userLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const result = await authServices.validateUserLoginService(email, password);

    res.status(200).json({
      success: true,
      message: "login successful",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const authController = {
  userLogin,
};
