import { PrismaClient } from "@prisma/client";
import { mockDeep, mockReset, DeepMockProxy } from "jest-mock-extended";
import prisma from "../utils/PrismaClient";
import teacherService from "./teacher.service";
import { AppError } from "../utils/AppError";

jest.mock("../utils/PrismaClient", () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>(),
}));

beforeEach(() => {
  mockReset(mockPrisma);
});

const mockPrisma = prisma as unknown as DeepMockProxy<PrismaClient>;
describe("registerStudents", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should throw error if teacher not found", async () => {
    mockPrisma.teacher.findUnique.mockResolvedValue(null);

    await expect(
      teacherService.registerStudents("teacher1@mail.com", [
        "student1@mail.com",
      ])
    ).rejects.toThrow(AppError);

    expect(mockPrisma.teacher.findUnique).toHaveBeenCalled();
  });

  it("should throw error if some students not found", async () => {
    mockPrisma.teacher.findUnique.mockResolvedValue({
      id: "1",
      email: "teacher1@mail.com",
    });
    mockPrisma.student.findMany.mockResolvedValue([
      { email: "student1@mail.com", id: "1", suspended: false },
    ]);

    await expect(
      teacherService.registerStudents("teacher1@mail.com", [
        "student1@mail.com",
        "student2@mail.com",
      ])
    ).rejects.toThrow("Students not found");

    expect(mockPrisma.student.findMany).toHaveBeenCalled();
  });

  it("should create relations for new students", async () => {
    mockPrisma.teacher.findUnique.mockResolvedValue({
      id: "1",
      email: "teacher1@mail.com",
    });
    mockPrisma.student.findMany.mockResolvedValue([
      { email: "student1@mail.com", id: "1", suspended: false },
      { email: "student2@mail.com", id: "2", suspended: false },
    ]);
    mockPrisma.teacherStudent.findMany.mockResolvedValue([]);
    mockPrisma.teacherStudent.createMany.mockResolvedValue({ count: 1 });

    await teacherService.registerStudents("teacher1@mail.com", [
      "student1@mail.com",
      "student2@mail.com",
    ]);

    expect(mockPrisma.teacherStudent.createMany).toHaveBeenCalledWith({
      data: [
        { teacherId: "1", studentId: "1" },
        { teacherId: "1", studentId: "2" },
      ],
      skipDuplicates: true,
    });
  });

  it("should skip creating if all relations exist", async () => {
    mockPrisma.teacher.findUnique.mockResolvedValue({
      id: "1",
      email: "teacher1@mail.com",
    });
    mockPrisma.student.findMany.mockResolvedValue([
      { email: "student1@mail.com", id: "1", suspended: false },
    ]);
    mockPrisma.teacherStudent.findMany.mockResolvedValue([
      { studentId: "1", id: "1", teacherId: "1" },
    ]);

    await teacherService.registerStudents("teacher1@mail.com", [
      "student1@mail.com",
    ]);

    expect(mockPrisma.teacherStudent.createMany).not.toHaveBeenCalled();
  });
});

describe("getCommonStudents", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should throw error if teacher not found", async () => {
    mockPrisma.teacher.findMany.mockResolvedValue([]);

    await expect(
      teacherService.getCommonStudents(["teacher1@mail.com"])
    ).rejects.toThrow(AppError);
  });

  it("should return empty if no relations", async () => {
    mockPrisma.teacher.findMany.mockResolvedValue([
      { id: "1", email: "teacher1@mail.com" },
    ]);
    mockPrisma.teacherStudent.findMany.mockResolvedValue([]);

    const result = await teacherService.getCommonStudents([
      "teacher1@mail.com",
    ]);
    expect(result).toEqual([]);
  });

  it("should return common students", async () => {
    mockPrisma.teacher.findMany.mockResolvedValue([
      { id: "1", email: "teacher1@mail.com" },
      { id: "2", email: "teacher2@mail.com" },
    ]);
    mockPrisma.teacherStudent.findMany.mockResolvedValue([
      { studentId: "1", teacherId: "1", id: "1" },
      { studentId: "1", teacherId: "2", id: "2" },
      { studentId: "2", teacherId: "1", id: "3" },
    ]);
    mockPrisma.student.findMany.mockResolvedValue([
      { id: "1", email: "student1@mail.com", suspended: false },
    ]);

    const result = await teacherService.getCommonStudents([
      "teacher1@mail.com",
      "teacher2@mail.com",
    ]);

    expect(result).toEqual(["student1@mail.com"]);
  });
});

describe("suspendStudent", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should throw error if student not found", async () => {
    mockPrisma.student.findUnique.mockResolvedValue(null);

    await expect(
      teacherService.suspendStudent("student@mail.com")
    ).rejects.toThrow(AppError);
  });

  it("should suspend student", async () => {
    mockPrisma.student.findUnique.mockResolvedValue({
      id: "1",
      email: " student@mail.com",
      suspended: false,
    });
    mockPrisma.student.update.mockResolvedValue({
      id: "1",
      email: " student@mail.com",
      suspended: true,
    });

    await teacherService.suspendStudent("student@mail.com");

    expect(mockPrisma.student.update).toHaveBeenCalledWith({
      where: { email: "student@mail.com" },
      data: { suspended: true },
    });
  });
});

describe("retrieveForNotifications", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should throw error if teacher not found", async () => {
    mockPrisma.teacher.findUnique.mockResolvedValue(null);

    await expect(
      teacherService.retrieveForNotifications(
        "teacher@mail.com",
        "Hello @student1@mail.com"
      )
    ).rejects.toThrow(AppError);
  });

  it("should return correct recipients", async () => {
    mockPrisma.teacher.findUnique.mockResolvedValue({
      id: "1",
      email: "teacher@mail.com",
      students: [
        { student: { email: "student1@mail.com", suspended: false } },
        { student: { email: "student2@mail.com", suspended: true } },
      ],
    } as any);

    mockPrisma.student.findMany.mockResolvedValue([
      { id: "3", email: "student3@mail.com", suspended: false },
    ]);

    const result = await teacherService.retrieveForNotifications(
      "teacher@mail.com",
      "Hello @student3@mail.com"
    );

    expect(result).toEqual(["student1@mail.com", "student3@mail.com"]);
  });
});
