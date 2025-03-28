import { AppError } from "../utils/AppError";
import MESSAGE from "../constants/message";
import { StatusCodes } from "http-status-codes";
import prisma from "../utils/PrismaClient";

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

const getCommonStudents = async (teacherEmails: string[]) => {
  const teachers = await prisma.teacher.findMany({
    where: { email: { in: teacherEmails } },
  });

  if (teachers.length !== teacherEmails.length) {
    throw new AppError({
      message: MESSAGE.TEACHER.NOT_FOUND,
      statusCode: StatusCodes.NOT_FOUND,
    });
  }
  const teacherIds = teachers.map((teacher) => teacher.id);
  const relations = await prisma.teacherStudent.findMany({
    where: {
      teacherId: { in: teacherIds },
    },
    select: { studentId: true, teacherId: true },
  });

  if (relations.length === 0) {
    return [];
  }
  const studentCount: Record<string, number> = {};
  relations.forEach((rel) => {
    studentCount[rel.studentId] = (studentCount[rel.studentId] || 0) + 1;
  });

  const commonStudentIds = Object.keys(studentCount).filter(
    (studentId) => studentCount[studentId] === teacherIds.length
  );

  if (commonStudentIds.length === 0) {
    return [];
  }

  const students = await prisma.student.findMany({
    where: {
      id: { in: commonStudentIds },
    },
    select: { email: true },
  });

  return students.map((s) => s.email);
};

const suspendStudent = async (student: string) => {
  const foundStudent = await prisma.student.findUnique({
    where: { email: student },
  });
  if (!foundStudent) {
    throw new AppError({
      message: MESSAGE.STUDENT.NOT_FOUND,
      statusCode: StatusCodes.NOT_FOUND,
    });
  }
  await prisma.student.update({
    where: { email: student },
    data: { suspended: true },
  });
  return;
};

const retrieveForNotifications = async (
  teacher: string,
  notification: string
) => {
  const mentionedEmails = notification
    .split(" ")
    .filter((word) => word.startsWith("@"))
    .map((word) => word.substring(1));

  const foundTeacher = await prisma.teacher.findUnique({
    where: { email: teacher },
    include: { students: { include: { student: true } } },
  });
  if (!foundTeacher) {
    throw new AppError({
      message: MESSAGE.TEACHER.NOT_FOUND,
      statusCode: StatusCodes.NOT_FOUND,
    });
  }

  const registeredStudents = foundTeacher.students
    .filter((ts) => !ts.student.suspended)
    .map((ts) => ts.student.email);

  const mentionedStudents = await prisma.student.findMany({
    where: {
      email: { in: mentionedEmails },
      suspended: false,
    },
  });

  const mentionedStudentEmails = mentionedStudents.map((s) => s.email);

  const recipients = Array.from(
    new Set([...registeredStudents, ...mentionedStudentEmails])
  );
  return recipients;
};

export default {
  registerStudents,
  getCommonStudents,
  suspendStudent,
  retrieveForNotifications,
};
