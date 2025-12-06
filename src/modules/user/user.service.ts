import { pool } from "../../config/db";
import bcrypt from "bcryptjs";

const createUserService = async (payload: Record<string, unknown>) => {

    const { name, email, password } = payload;

    const hashedPass = await bcrypt.hash(password as string, 10);

      const result = await pool.query(
          `INSERT INTO users(name, email, password) VALUES($1, $2, $3) RETURNING *`,
          [name, email, hashedPass]
        );

        return result
}

const getUserService = async () => {
    const result = await pool.query(`SELECT * from users`);
    return result
}

const getSingleUserService =  async (id: string) => {
    const result = await pool.query(`SELECT * from users WHERE id = $1`, [
    id,
    ]);
    
    return result
}


const updateUserServices =  async (name: string, email: string, id:string) => {
    const result = await pool.query(
      `UPDATE users SET name=$1, email=$2 WHERE id=$3 RETURNING *`,
      [name, email, id]

    );

    return result
}


const deleteUserServices =  async (id: string) => {
   const result = await pool.query(`DELETE FROM users WHERE id = $1`, [
      id,
    ]);
    console.log(result);

    return result
}

export const userServices = {
    createUserService,
    getUserService,
    getSingleUserService,
    updateUserServices,
    deleteUserServices
    

}