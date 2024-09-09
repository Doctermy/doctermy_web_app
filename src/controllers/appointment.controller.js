import AppointmentService from "../services/appointment.service.js";
import { USER_TYPES, STATUS } from "../utils/user.js";
import { convertToStartTime, getValidAppointmentDate } from "../utils/time.js";
import UserService from "../services/user.service.js";

class AppointmentController {
  /***** BOOK APPOINTMENT *****/
  //create request for an appointment
  async createAppointment(req, res) {
    //declare variables
    const { body } = req;
    const { _id: userId, role: userType } = req.user;
    let patient = null;
    let doctor = null;

    // set doctorId or patientId based on user role && reassign patient and doctor to be the current user
    if (userType === USER_TYPES.PATIENT) {
      body.patientId = userId;
      patient = await req.user;
    } else if (userType === USER_TYPES.DOCTOR) {
      body.doctorId = userId;
      doctor = await req.user;
    } else {
      return res.status(403).send({
        success: false,
        message: "Unauthorized user type",
      });
    }

    //get patient's details if user is a doctor using the ID of the patient from the body data
    if (!patient) {
      patient = await UserService.findUser({ _id: body.patientId });
      if (!patient) {
        return res.status(404).send({
          success: false,
          message: "Invalid patient Id",
        });
      }
    }
    //get doctor's details if user is a patient using the ID of the doctor from the body data
    if (!doctor) {
      doctor = await UserService.findUser({ _id: body.doctorId });
      if (!doctor) {
        return res.status(404).send({
          success: false,
          message: "Invalid doctor Id",
        });
      }
    }

    //get the doctor's available days from the doctor's data
    const availableDays = await doctor.availableDays;

    //check if selected date is included in the available days
    const validDate = getValidAppointmentDate(body.date, availableDays);
    if (!validDate) {
      return res.status(403).send({
        success: false,
        message: "The selected date is not available.",
      });
    }

    //get the doctor's available time from the doctor's data
    const availableTime = await doctor.availableTime;

    // Check if the desired time is available
    const selectedTime = availableTime.find((time) => time === body.timeValue);
    console.log("timeValue", selectedTime);
    if (!selectedTime) {
      return res.status(403).send({
        success: false,
        message: "The selected time is not available.",
      });
    }

    // Convert timeValue and date to startTime
    const startTime = convertToStartTime(body.timeValue, validDate);
    body.startTime = startTime;

    // Remove timeValue and date from the value object as they're not in the schema
    delete body.timeValue;
    delete body.date;

    //check if there's another appointment scheduled for the same startTime
    const conflictingAppointment = await AppointmentService.getOneAppointment({
      doctorId: body.doctorId,
      startTime,
      status: { $in: [STATUS.PENDING, STATUS.APPROVED] },
    });
    if (conflictingAppointment) {
      return res.status(403).send({
        success: false,
        message: `${doctor.name} has another appointment at the selected time. Please select another time`,
      });
    }

    // Set status and bookedBy based on who's booking the appointment
    body.status =
      userType === USER_TYPES.DOCTOR ? STATUS.APPROVED : STATUS.PENDING;
    body.bookedBy = userType;

    //prepare to create new appointment
    const newAppointment = await AppointmentService.createAppointment(body);

    return res.status(201).send({
      //return the new created appointment
      success: true,
      message: "Appointment created sucessfully",
      data: newAppointment,
    });
  }

  /***** GET ALL APPOINTMENTS *****/
  //retrieve all appointments or those that matches a query
  async getAllAppointments(req, res) {
    //declare variables
    const { query } = req;
    const { _id: userId, role: userType } = req.user;

    // Set doctorId or patientId based on user role
    userType === USER_TYPES.PATIENT
      ? (query.patientId = userId)
      : userType === USER_TYPES.DOCTOR
      ? (query.doctorId = userId)
      : null;

    //retrieve all appointments based on passed query
    const allAppointments = await AppointmentService.getAllAppointments(query);
    if (allAppointments.length === 0) {
      return res.status(404).send({
        success: false,
        message: "No appointments found",
      });
    }
    return res.status(200).send({
      //return retrieved appointments from the database
      success: true,
      message: "Appointments retrieved sucessfully",
      data: allAppointments,
    });
  }

  /***** GET ONE APPOINTMENT *****/
  //retrieve one appointment that matches an id
  async getOneAppointment(req, res) {
    const { _id: userId, role: userType } = req.user;
    const query = { _id: req.params.id };

    userType === USER_TYPES.PATIENT
      ? (query.patientId = userId)
      : userType === USER_TYPES.DOCTOR
      ? (query.doctorId = userId)
      : null;

    const appointment = await AppointmentService.getOneAppointment(query);
    if (!appointment) {
      return res.status(404).send({
        success: false,
        message: "No appointment found",
      });
    }

    return res.status(200).send({
      success: true,
      message: "Appointment retrieved sucessfully",
      data: appointment,
    });
  }

  /***** UPDATE APPOINTMENT *****/
  //update appointment by patients
  async updateAppointment(req, res) {
    //declare variables
    const query = { _id: req.params.id };
    const { status, remark, ...otherUpdates } = req.body;
    const { _id: userId, role: userType } = req.user;

    query.patientId = userId;

    // Check if the appointment exists
    const foundAppointment = await AppointmentService.getOneAppointment(query);
    if (!foundAppointment) {
      return res.status(404).send({
        success: false,
        message: "Appointment does not exist",
      });
    }

    if (userType === USER_TYPES.PATIENT) {
      // Prevent patients from updating status or adding a remark
      if (status || remark) {
        return res.status(403).send({
          success: false,
          message: "Patients are not allowed to update status or add remarks",
        });
      }

      // Prevent modification if the appointment status is not pending
      if (foundAppointment.status !== STATUS.PENDING) {
        return res.status(400).send({
          success: false,
          message: "You can no longer modify the appointment",
        });
      }
    }

    //to update appointment time, first get the doctor from the database
    const doctor = await UserService.findUser(foundAppointment.doctorId);
    if (!doctor) {
      return res.status(404).send({
        success: false,
        message: "Invalid doctor Id",
      });
    }

    //get the doctor's available days from the doctor's data
    const availableDays = await doctor.availableDays;

    //check if selected date is included in the available days
    const validDate = getValidAppointmentDate(otherUpdates.date, availableDays);
    if (!validDate) {
      return res.status(403).send({
        success: false,
        message: "The selected date is not available.",
      });
    }

    //get the doctor's available time from the doctor's data
    const availableTime = await doctor.availableTime;

    // Check if the desired time is available
    const selectedTime = availableTime.find(
      (time) => time === otherUpdates.timeValue
    );
    console.log("timeValue", selectedTime);
    if (!selectedTime) {
      // throw new Error(`The desired time ${body.timeValue} is not available.`);
      return res.status(403).send({
        success: false,
        message: "The selected time is not available.",
      });
    }

    // Convert timeValue and date to startTime
    const startTime = convertToStartTime(otherUpdates.timeValue, validDate);
    otherUpdates.startTime = startTime;

    // Remove timeValue and date from the value object as they're not in the schema
    delete otherUpdates.timeValue;
    delete otherUpdates.date;

    // Update the appointment data (excluding status and remark if the user is a patient)
    const updatedAppointment = await AppointmentService.update(
      query,
      otherUpdates
    );
    return res.status(200).send({
      success: true,
      message: "Appointment updated successfully",
      data: updatedAppointment,
    });
  }

  /***** UPDATE APPOINTMENT STATUS *****/
  //update status by doctors
  async updateStatus(req, res) {
    const query = { _id: req.params.id };
    const { status, remark } = req.body;
    const userId = req.user._id;

    query.doctorId = userId;

    //check if the appointment exists
    const foundAppointment = await AppointmentService.getOneAppointment(query);
    console.log(foundAppointment);

    if (!foundAppointment) {
      return res.status(404).send({
        success: false,
        message: "Appointment does not exist",
      });
    }

    // Check if the doctor is trying to set an invalid status
    if (
      status !== STATUS.APPROVED &&
      status !== STATUS.DECLINED &&
      status !== STATUS.COMPLETED
    ) {
      return res.status(400).send({
        success: false,
        message: "Invalid status update",
      });
    }

    //to prevent adding remarks to approved and completed appointments
    if (remark && status !== STATUS.DECLINED) {
      return res.status(400).send({
        success: false,
        message: "You cannot add remark to this status",
      });
    }

    //prepare the update data
    let updateData = { remark, status, doctorUpdatedAt: Date.now() };

    //to ensure remark is provided for declined appointments
    if (!remark && updateData.status === STATUS.DECLINED) {
      return res.status(400).send({
        success: false,
        message: "You must provide a remark",
      });
    }

    //to prevent pending and declined appointment from being updated to completed
    if (
      updateData.status === STATUS.COMPLETED &&
      foundAppointment.status !== STATUS.APPROVED
    ) {
      return res.status(400).send({
        success: false,
        message: "You cannot perform this action",
      });
    }

    //if the status is completed, register the end time
    if (status === STATUS.COMPLETED) {
      updateData.endTime = Date.now();
    }

    //update the appointment status
    const updatedAppointment = await AppointmentService.update(
      query,
      updateData
    );
    return res.status(200).send({
      success: true,
      message: "Appointment status updated sucessfully",
      data: updatedAppointment,
    });
  }
}

export default new AppointmentController();