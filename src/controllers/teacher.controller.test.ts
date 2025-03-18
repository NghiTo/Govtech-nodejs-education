import { NextFunction, Request, Response } from "express";
import teacherController from "../../src/controllers/teacher.controller";
import teacherService from "../../src/services/teacher.service";
import { StatusCodes } from "http-status-codes";

jest.mock("../../src/services/teacher.service");

describe("Teacher Controller - registerStudents", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;
  let jsonMock = jest.fn();
  let statusMock = jest.fn().mockReturnThis();

  beforeEach(() => {
    req = {
      body: {
        teacher: "teacherken@gmail.com",
        students: ["studentjon@gmail.com", "studenthon@gmail.com"],
      },
    };
    res = {
      status: statusMock,
      json: jsonMock,
    };
    next = jest.fn(); // Mock next
    jest.clearAllMocks();
  });

  it("should register students and return 204 No Content", async () => {
    (teacherService.registerStudents as jest.Mock).mockResolvedValue(undefined);

    await teacherController.registerStudents(
      req as Request,
      res as Response,
      next
    );

    expect(teacherService.registerStudents).toHaveBeenCalledWith(
      req.body.teacher,
      req.body.students
    );
    expect(statusMock).toHaveBeenCalledWith(StatusCodes.NO_CONTENT);
    expect(jsonMock).toHaveBeenCalledWith();
    expect(next).not.toHaveBeenCalled();
  });
});
