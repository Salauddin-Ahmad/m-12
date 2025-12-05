import express, { NextFunction, Request, Response } from "express";

import config from "./config";
import initDB, { pool } from "./config/db";

const app = express();
const port = config.port;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// logger middleware

const logger = (req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}\n`);
  next();
};

app.post("/users", async (req: Request, res: Response) => {
  const { name, email } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO users(name, email) VALUES($1, $2) RETURNING *`,
      [name, email]
    );

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
});

app.get("/users", logger, async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`SELECT * from users`);
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
});
app.get("/users/:id", async (req: Request, res: Response) => {
  try {
    console.log(req.params.id);

    const result = await pool.query(`SELECT * from users WHERE id = $1`, [
      req.params.id,
    ]);
    console.log(result);

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
});

app.put("/users/:id", async (req: Request, res: Response) => {
  try {
    // console.log(req.params.id);

    const { name, email } = req.body;

    const result = await pool.query(
      `UPDATE users SET name=$1, email=$2 WHERE id=$3 RETURNING *`,
      [name, email, req.params.id]
    );
    console.log(result);

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
});

app.delete("/users/:id", async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.id);

    const result = await pool.query(`DELETE FROM users WHERE id = $1`, [
      req.params.id,
    ]);
    console.log(result);

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
});

// todos crud

app.post("/todos", async (req: Request, res: Response) => {
  try {
    let { user_id, title } = req.body;
    const userId = Number(user_id);

    const result = await pool.query(
      `INSERT INTO todos(user_id, title) 
      VALUES($1, $2) returning *`,
      [userId, title]
    );

    console.log(result);

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
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "rote not found",
    path: req.path,
  });
});

initDB().then(() => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});
