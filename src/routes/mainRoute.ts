import { Router } from "express";
import teacherController from "../controllers/teacher.controller";

const router = Router();

router.post("/register", teacherController.registerStudents);

export default router;
