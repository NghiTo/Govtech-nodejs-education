import { Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import teacherService from "../services/teacher.service";
import { StatusCodes } from "http-status-codes";

const registerStudents = catchAsync(async (req: Request, res: Response) => {
  const { teacher, students } = req.body;
  await teacherService.registerStudents(teacher, students);
  return res.status(StatusCodes.NO_CONTENT).json();
});

export default { registerStudents };
