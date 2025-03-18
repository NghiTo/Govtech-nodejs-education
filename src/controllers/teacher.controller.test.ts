import { Request, Response, NextFunction } from "express";
import teacherController from "./teacher.controller";
import teacherService from "../services/teacher.service";
import { StatusCodes } from "http-status-codes";

jest.mock("../services/teacher.service");

describe("Teacher Controller", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("registerStudents", () => {
    it("should register students and return 204 status", async () => {
      req.body = {
        teacher: "teacher@example.com",
        students: ["student1@example.com", "student2@example.com"],
      };
      (teacherService.registerStudents as jest.Mock).mockResolvedValue(
        undefined
      );

      await teacherController.registerStudents(
        req as Request,
        res as Response,
        next
      );

      expect(teacherService.registerStudents).toHaveBeenCalledWith(
        "teacher@example.com",
        ["student1@example.com", "student2@example.com"]
      );
      expect(res.status).toHaveBeenCalledWith(StatusCodes.NO_CONTENT);
      expect(res.json).toHaveBeenCalled();
    });
  });

  describe("getCommonStudents", () => {
    it("should return common students and 200 status when teacher is an array", async () => {
      req.query = { teacher: ["teacher1@example.com", "teacher2@example.com"] };
      const commonStudents = ["student1@example.com", "student2@example.com"];
      (teacherService.getCommonStudents as jest.Mock).mockResolvedValue(
        commonStudents
      );

      await teacherController.getCommonStudents(
        req as Request,
        res as Response,
        next
      );

      expect(teacherService.getCommonStudents).toHaveBeenCalledWith([
        "teacher1@example.com",
        "teacher2@example.com",
      ]);
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith({ students: commonStudents });
    });

    it("should return common students and 200 status when teacher is a single string", async () => {
      req.query = { teacher: "teacher1@example.com" };
      const commonStudents = ["student1@example.com", "student2@example.com"];
      (teacherService.getCommonStudents as jest.Mock).mockResolvedValue(
        commonStudents
      );

      await teacherController.getCommonStudents(
        req as Request,
        res as Response,
        next
      );

      expect(teacherService.getCommonStudents).toHaveBeenCalledWith([
        "teacher1@example.com",
      ]);
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith({ students: commonStudents });
    });
  });

  describe("suspendStudent", () => {
    it("should suspend a student and return 204 status", async () => {
      req.body = { student: "student@example.com" };
      (teacherService.suspendStudent as jest.Mock).mockResolvedValue(undefined);

      await teacherController.suspendStudent(
        req as Request,
        res as Response,
        next
      );

      expect(teacherService.suspendStudent).toHaveBeenCalledWith(
        "student@example.com"
      );
      expect(res.status).toHaveBeenCalledWith(StatusCodes.NO_CONTENT);
      expect(res.json).toHaveBeenCalled();
    });
  });

  describe("retrieveForNotifications", () => {
    it("should retrieve recipients for notifications and return 200 status", async () => {
      req.body = {
        teacher: "teacher@example.com",
        notification: "Hello @student1@example.com",
      };
      const recipients = ["student1@example.com", "student2@example.com"];
      (teacherService.retrieveForNotifications as jest.Mock).mockResolvedValue(
        recipients
      );

      await teacherController.retrieveForNotifications(
        req as Request,
        res as Response,
        next
      );

      expect(teacherService.retrieveForNotifications).toHaveBeenCalledWith(
        "teacher@example.com",
        "Hello @student1@example.com"
      );
      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith({ recipients });
    });
  });
});
