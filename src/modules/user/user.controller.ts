import express, { Request, Response } from "express";
import { pool } from "../../config/db";
import { userServices } from "./user.service";

const creatUser = async (req: Request, res: Response) => {
  try {
    const result = await userServices.createUserService(req.body);

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

const getUser = async (req: Request, res: Response) => {
  try {
    const result = await userServices.getUserService();
    res.status(200).json({
      success: true,
      message: "users retrieved successfully",
      data: result.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      details: error,
    });
  }
};

const getSingleUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const result = await userServices.getSingleUserService(id!); //same =>  as string

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "users not found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "user fetched successfully",
        data: result.rows[0],
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      details: error,
    });
  }
};

const updateSingleUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const {name, email} = req.body; 

    const result = await userServices.updateUserServices(name, email, id!); //same =>  as string

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "users not found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "user updated successfully",
        data: result.rows[0],
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      details: error,
    });
  }
};

const deleteSingleUser = async (req: Request, res: Response) => {
  try {
   const id = req.params.id;
    const result = await userServices.deleteUserServices(id!)
    if (result.rowCount === 0) {
      res.status(404).json({
        success: false,
        message: "users not found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "user deleted successfully",
        data: result.rows,
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      details: error,
    });
  }
}




export const userControllers = {
  creatUser,
  getUser,
  getSingleUser,
  updateSingleUser,
  deleteSingleUser
};
