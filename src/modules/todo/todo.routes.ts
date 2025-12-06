import  express from 'express';
import { todoControllers } from './todo.controller';
const router = express.Router()

router.post("/", todoControllers.crateTodo)



export const todoRoutes = router