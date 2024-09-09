import { Schema, model } from "mongoose";
import {
  APPOINTMENT_TYPES,
  STATUS,
  USER_TYPES,
} from "../utils/user.js";

const appointmentSchema = new Schema(
  {
    type: {
      type: String,
      required: true,
      enum: Object.values(APPOINTMENT_TYPES),
      default: APPOINTMENT_TYPES.CONSULTATION,
    },

    doctorId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },

    patientId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },

    status: {
      type: String,
      enum: Object.values(STATUS),
      default: STATUS.PENDING,
    },

    startTime: {
      type: Date,
      required: true,
    },

    endTime: {
      type: Date,
      default: null,
    },

    complaint: {
      type: String,
      default: null,
    },

    doctorUpdatedAt: {
      type: Date,
      default: null,
    },

    bookedBy: {
      type: String,
      enum: [USER_TYPES.DOCTOR, USER_TYPES.PATIENT],
    },

    remark: {
      type: String,
      default: null,
    },

    paid: {
      type: Boolean,
      default: false,
    },

    paymentReference: {
      type: String,
      default: null,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const AppointmentModel = new model("appointment", appointmentSchema);
export default AppointmentModel;