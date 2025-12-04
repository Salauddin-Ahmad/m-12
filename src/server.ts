import express, { Request, Response } from "express";
import { Pool } from "pg";

import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = 5000;

// DB
const pool = new Pool({
  connectionString: process.env.PGURL,
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const initDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        age INT,
        phone VARCHAR(15),
        address TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);

    await pool.query(`
    CREATE TABLE IF NOT EXISTS todos(
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(200) NOT NULL,
        description TEXT,
        completed BOOLEAN DEFAULT false,
        due_date DATE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
  );
`);

    console.log("Tables created");
  } catch (error) {
    console.error("DB Init Error:", error);
  }
};

initDB().then(() => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});

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

app.get("/users", async (req: Request, res: Response) => {
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
    // res.status(200).json({
    //   success: true,
    //   message: "users retrieved successfully",
    //   data: result.rows,
    // });

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "users not found",
      });
    }
    else {
        res.status(200).json({
        success: true,
        message: "user fetched successfully",
        data: result.rows[0]
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
