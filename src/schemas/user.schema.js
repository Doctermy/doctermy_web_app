import Joi from "joi";
import {
  USER_TYPES,
  GENDER,
  SPECIALTY,
  DAYS,
  TIME_SLOTS,
} from "../utils/user.js";


/***** CREATE USERS SCHEMA *****/
const signUpSchema = Joi.object({
  name: Joi.string().trim().required(),

  email: Joi.string().trim().email().lowercase().required(),

  phoneNumber: Joi.string()
    .pattern(new RegExp(/^(?:\+?234|0)?[789]\d{9}$/))
    .required(),

  password: Joi.string()
    .pattern(
      new RegExp(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,30}$/
      )
    )
    .trim()
    .when("role", {
      is: USER_TYPES.PATIENT,
      then: Joi.required().default("patient"),
    })
    .when("role", {
      is: USER_TYPES.SUPERADMIN || USER_TYPES.ADMIN || USER_TYPES.DOCTOR,
      then: Joi.required().default("user"),
    }),

  gender: Joi.string().valid(...Object.values(GENDER)),

  hospitalId: Joi.string().default("0001"),

  imageUrl: Joi.string().default(
    "https://res.cloudinary.com/djikxrhef/image/upload/v1725466824/th5z964dwqwrp2jtux9m.png"
  ),

  specialty: Joi.string()
    .valid(...Object.values(SPECIALTY))
    .when("role", {
      is: USER_TYPES.DOCTOR,
      then: Joi.required(),
    }),

  availableDays: Joi.array()
    .items(Joi.string().valid(...Object.values(DAYS)))
    .when("role", {
      is: USER_TYPES.DOCTOR,
      then: Joi.required(),
    }),

  availableTime: Joi.array()
    .items(Joi.string().valid(...TIME_SLOTS))
    .when("role", {
      is: USER_TYPES.DOCTOR,
      then: Joi.required(),
    }),
});


/***** LOGIN USERS SCHEMA *****/
const loginSchema = Joi.object({
  email: Joi.string().lowercase().required(),
  password: Joi.string().required(),
});


/***** UPDATE USERS SCHEMA *****/
const updateUserSchema = Joi.object({
  email: Joi.string().trim().email().lowercase().optional(),

  phoneNumber: Joi.string()
    .pattern(new RegExp(/^(?:\+?234|0)?[789]\d{9}$/))
    .optional(),

  password: Joi.string()
    .pattern(
      new RegExp(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,30}$/
      )
    )
    .trim()
    .optional(),

  gender: Joi.string()
    .valid(...Object.values(GENDER))
    .optional(),

  hospitalId: Joi.string().default("0001"),

  imageUrl: Joi.string().default(
    "https://res.cloudinary.com/djikxrhef/image/upload/v1725466824/th5z964dwqwrp2jtux9m.png"
  ),

  uniqueId: Joi.string().optional(),

  address: Joi.string().optional(),

  dateOfBirth: Joi.date().optional(),

  specialty: Joi.string()
    .valid(...Object.values(SPECIALTY))
    .when("role", {
      is: "USER_TYPES.DOCTOR",
      then: Joi.optional(),
    }),

  availableDays: Joi.string()
    .valid(...Object.values(DAYS))
    .when("role", {
      is: USER_TYPES.DOCTOR,
      then: Joi.optional(),
    }),

  availableTime: Joi.array()
    .valid(...TIME_SLOTS)
    .when("role", {
      is: USER_TYPES.DOCTOR,
      then: Joi.optional(),
    }),
});


export { signUpSchema, loginSchema, updateUserSchema };