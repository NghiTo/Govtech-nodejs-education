import { AppError } from "./AppError";

describe("AppError", () => {
  it("should create an error instance with correct message and statusCode", () => {
    const errorMessage = "Something went wrong";
    const statusCode = 400;

    const error = new AppError({ message: errorMessage, statusCode });

    expect(error).toBeInstanceOf(AppError);
    expect(error).toBeInstanceOf(Error);

    expect(error.message).toBe(errorMessage);
    expect(error.statusCode).toBe(statusCode);

    expect(error.stack).toBeDefined();
  });

  it("should have the correct prototype chain", () => {
    const error = new AppError({ message: "Error", statusCode: 500 });

    expect(Object.getPrototypeOf(error)).toBe(AppError.prototype);
  });
});
