import { celebrate, Joi, Segments } from "celebrate";

export const registerValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    teacher: Joi.string().email().required().messages({
      "string.empty": `"teacher" email is required`,
      "string.email": `"teacher" must be a valid email`,
    }),
    students: Joi.array()
      .items(Joi.string().email().required())
      .min(1)
      .required()
      .messages({
        "array.base": `"students" must be an array of emails`,
        "array.min": `"students" must contain at least 1 student`,
      }),
  }),
});

export const commonStudentsValidation = celebrate({
  [Segments.QUERY]: Joi.object({
    teacher: Joi.alternatives()
      .try(
        Joi.string().email(),
        Joi.array().items(Joi.string().email())
      )
      .required()
      .messages({
        "any.required": `"teacher" query parameter is required`,
        "string.email": `"teacher" must be a valid email`,
        "array.includes": `"teacher" must contain valid email(s)`,
      }),
  }),
});

export const suspendStudentValidation = celebrate({
  [Segments.BODY]: Joi.object({
    student: Joi.string()
      .email()
      .required()
      .messages({
        "any.required": `"student" field is required`,
        "string.email": `"student" must be a valid email`,
      }),
  }),
});

export const retrieveForNotificationsValidation = celebrate({
  [Segments.BODY]: Joi.object({
    teacher: Joi.string().email().required().messages({
      'any.required': `"teacher" field is required`,
      'string.email': `"teacher" must be a valid email`,
    }),
    notification: Joi.string().required().messages({
      'any.required': `"notification" field is required`,
    }),
  }),
});
