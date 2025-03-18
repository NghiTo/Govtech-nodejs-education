import { Router } from "express";
import teacherController from "../controllers/teacher.controller";
import {
  commonStudentsValidation,
  registerValidation,
  retrieveForNotificationsValidation,
  suspendStudentValidation,
} from "../validations/validation";

const router = Router();

router.post(
  "/register",
  registerValidation,
  teacherController.registerStudents
);
router.post(
  "/suspend",
  suspendStudentValidation,
  teacherController.suspendStudent
);
router.post(
  "/retrievefornotifications",
  retrieveForNotificationsValidation,
  teacherController.retrieveForNotifications
);

router.get(
  "/commonstudents",
  commonStudentsValidation,
  teacherController.getCommonStudents
);

export default router;
