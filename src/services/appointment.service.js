import AppointmentModel from "../models/appointment.model.js";

class AppointmentService {
  //create appointment
  async createAppointment(data) {
    const newAppointment = await AppointmentModel.create(data);
    return newAppointment;
  }

  //retrieve all appointments || those that matches a query
  async getAllAppointments(query) {
    const allAppointments = await AppointmentModel
      .find(query)
      .populate("patientId", "name")
      .populate("doctorId", "name");
    return allAppointments;
  }

  //find appointment that matches an id
  async getOneAppointment(query) {
    const appointment = await AppointmentModel
      .findOne(query)
      .populate("patientId", "name")
      .populate("doctorId", "name");
    return appointment;
  }

  //update appointment
  async update(query, data) {
    const updatedAppointment = await AppointmentModel.findOneAndUpdate(
      query,
      data,
      { new: true }
    );
    return updatedAppointment;
  }

  //delete appointment
  async delAppointment(query) {
    const deletedAppointment = await AppointmentModel.findOneAndDelete(query);
    return deletedAppointment;
  }
}

export default new AppointmentService();