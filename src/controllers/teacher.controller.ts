import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import teacherService from "../services/teacher.service";
import { StatusCodes } from "http-status-codes";

const registerStudents = catchAsync(async (req, res, next) => {
  const { teacher, students } = req.body;
  await teacherService.registerStudents(teacher, students);
  return res.status(StatusCodes.NO_CONTENT).json();
});

const getCommonStudents = catchAsync(async (req, res, next) => {
  let teacherEmails = req.query.teacher;
  if (!Array.isArray(teacherEmails)) {
    teacherEmails = [teacherEmails!!];
  }
  const students = await teacherService.getCommonStudents(
    teacherEmails as string[]
  );
  return res.status(StatusCodes.OK).json({ students });
});

const suspendStudent = catchAsync(async (req, res, next) => {
  const student = req.body.student;
  await teacherService.suspendStudent(student);
  return res.status(StatusCodes.NO_CONTENT).json();
});

const retrieveForNotifications = catchAsync(async (req, res, next) => {
  const { teacher, notification } = req.body;
  const recipients = await teacherService.retrieveForNotifications(
    teacher,
    notification
  );
  return res.status(StatusCodes.OK).json({ recipients });
});

export default { registerStudents, getCommonStudents, suspendStudent, retrieveForNotifications };
