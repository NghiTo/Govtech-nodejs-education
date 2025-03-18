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
