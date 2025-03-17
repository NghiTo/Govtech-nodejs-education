import { PrismaClient } from "@prisma/client";
import { AppError } from "../utils/AppError";
import MESSAGE from "../constants/message";
import { StatusCodes } from "http-status-codes";

const prisma = new PrismaClient();

const registerStudents = async (
  teacherEmail: string,
  studentEmails: string[]
) => {
  const teacher = await prisma.teacher.findUnique({
    where: { email: teacherEmail },
  });

  if (!teacher) {
    throw new AppError({
      message: MESSAGE.TEACHER.NOT_FOUND,
      statusCode: StatusCodes.NOT_FOUND,
    });
  }

  const students = await prisma.student.findMany({
    where: {
      email: { in: studentEmails },
    },
  });

  const foundEmails = students.map((s) => s.email);
  const missing = studentEmails.filter((s) => !foundEmails.includes(s));
  if (missing.length > 0) {
    throw new AppError({
      message: `Students not found: ${missing.join(", ")}`,
      statusCode: StatusCodes.NOT_FOUND,
    });
  }

  const existingRelations = await prisma.teacherStudent.findMany({
    where: {
      teacherId: teacher.id,
      studentId: { in: students.map((s) => s.id) },
    },
    select: { studentId: true },
  });

  const existingStudentIds = existingRelations.map((r) => r.studentId);

  const newStudents = students.filter(
    (s) => !existingStudentIds.includes(s.id)
  );

  if (newStudents.length > 0) {
    await prisma.teacherStudent.createMany({
      data: newStudents.map((student) => ({
        teacherId: teacher.id,
        studentId: student.id,
      })),
      skipDuplicates: true,
    });
  }
  return;
};

export default { registerStudents };
