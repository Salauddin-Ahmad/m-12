// import express, { Request, Response } from "express";

// import { Pool } from "pg";

// const app = express();
// const port = 5000;

// // DB
// const pool = new Pool({
//   connectionString: `postgresql://neondb_owner:npg_Ila1BLG4CpFq@ep-restless-base-afctc6th-pooler.c-2.us-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require`,
// });

// app.use(express.json());
// app.use(express.urlencoded());

// const initDB = async () => {
//   await pool.query(`
//         CREATE TABLE IF NOT EXISTS users(
//         id SERIAL PRIMARY KEY,
//         name VARCHAR(100) NOT NULL,
//         email VARCHAR(150) UNIQUE NOT NULL,
//         age INT,
//         phone VARCHAR(15),
//         address TEXT,
//         created_at TIMESTAMP DEFAULT NOW(),
//         updated_at TIMESTAMP DEFAULT NOW()
//         )
//         `);

//   await pool.query(`
//             CREATE TABLE IF NOT EXISTS todos(
//             id SERIAL PRIMARY KEY,
//             user_id INT REFERENCES users(id) ON DELETE CASCADE,
//             title VARCHAR(200) NOT NULL,
//             description TEXT,
//             completed BOOLEAN DEFAULT false,
//             due_date DATE,
//             created_at TIMESTAMP DEFAULT NOW(),
//             updated_at TIMESTAMP DEFAULT NOW()
//             )
//             `);
// };

// initDB().then(() => {
//   app.listen(port, () => console.log(`DATABASE Server running`));
// });

// app.get("/", (req: Request, res: Response) => {
//   res.send("Hello World!");
// });

// app.post("/p", (req: Request, res: Response) => {
//   console.log(req.body);

//   res.status(201).json({
//     success: true,
//     message: "API is working",
//   });
// });

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`);
// });

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
    CREATE TABLE IF NOT EXISTS todos (
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
