// • GET /hospitals/:hospitalId/specialties: Get a list of specialties offered by a specific hospital.
// • GET /hospitals/:hospitalId/departments: Get a list of departments within a hospital (e.g., Emergency, Cardiology, Pediatrics).

import HospitalModel from "../models/hospital.model.js";

class HospitalService {

    // creates an existing hospital to the website
    async createHospital(data){
        const hospital = await HospitalModel.create(data);
        return hospital
    }

    // finds a hospital the matches an id
    async getHospitalById(hospitalId){
        const hospital = await HospitalModel.findById(hospitalId);
        return hospital;
    }

    // returns the hospital that matches the query
    async getHospitalByQuery(query){
        const hospital = await HospitalModel.find(query);
        return hospital;
    }

    // returns a list of all the hospitals
    async getAllHospitals(){
        const hospitals = await HospitalModel.find();
        return hospitals;
    }

    // find a product by the id and updates
    async updateHospital(hospitalId, data){
        const updatedHospital = await HospitalModel.findByIdAndUpdate(hospitalId, data, {new: true});
        return updatedHospital;
    }

    // delete the hospital by id
    async deleteHospital(hospitalId){
        const deleteHospital = await HospitalModel.findByIdAndDelete(hospitalId);
        return deleteHospital;
    }

    
    
}

export default new HospitalService();