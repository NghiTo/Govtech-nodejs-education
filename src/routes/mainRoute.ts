import { Router } from "express";
import teacherController from "../controllers/teacher.controller";
import { registerValidation } from "../validations/register.validation";

const router = Router();

router.post(
  "/register",
  registerValidation,
  teacherController.registerStudents
);

router.get("/commonstudents", teacherController.getCommonStudents)

export default router;
