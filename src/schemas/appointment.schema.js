import Joi from "joi";
import { APPOINTMENT_TYPES, STATUS, TIME_SLOTS } from "../utils/user.js";

//create appointment schema
const createAppointmentSchema = Joi.object({
  type: Joi.string()
    .valid(...Object.values(APPOINTMENT_TYPES))
    .required(),

  doctorId: Joi.string(),

  patientId: Joi.string(),

  status: Joi.string()
    .valid(...Object.values(STATUS))
    .default("STATUS.PENDING"),

  timeValue: Joi.string()
    .valid(...TIME_SLOTS)
    .required(),

  date: Joi.date().required(),

  complaint: Joi.string(),
});

//update appointment schema
const updateAppointmentSchema = Joi.object({
  type: Joi.string()
    .valid(...Object.values(APPOINTMENT_TYPES))
    .optional(),

  doctorId: Joi.string(),

  patientId: Joi.string(),

  timeValue: Joi.string()
    .valid(...TIME_SLOTS)
    .optional(),

  date: Joi.date().optional(),

  complaint: Joi.string(),

  remark: Joi.string(),
});

export { createAppointmentSchema, updateAppointmentSchema };