import HospitalService from "../services/hospital.service.js"

class HospitalController{

    // Create new hospital
    async createHospital(req,res){
        const hospitalData = req.body;
        const newHospital = await HospitalService.createHospital(hospitalData);
        res.status(201).send({
            success:true,
            message:"Hospital registered successfully",
            newHospital
        })
    }

    // finds a hospital the matches an id
    async getHospitalById(req,res){
       const hospitalId = req.params.hospitalId;
       const hospital = await HospitalService.getHospitalById(hospitalId); 
       if (!hospital){
            return res.status(404).send({
                message: "Invalid_id",
                success: false
            })
       }
       return res.status(200).send({
        success: true,
        hospital
       })
    }

    // returns the hospital that matches the query
    async getHospitalByQuery(req, res){
       const hospitalQuery = req.query;
       const hospitalQueried = await HospitalService.getHospitalByQuery(hospitalQuery)
       res.status(200).send({
            success: true,
            hospitalQueried
       })

    }

    // returns a list of all the hospitals
    async getAllHospitals(req, res){
        const hospitals = await HospitalService.getAllHospitals();
        res.status(200).send({
            success: true,
            hospitals
        })
    }

    // find a hospital by the id and updates
    async updateHospital(req, res){
        const hospitalId = req.params.hospitalId;
        const data = req.body;
        const foundHospital = await HospitalService.getHospitalById(hospitalId)
        if(!foundHospital){
            return res.status(404).send({
                message: "invalid_id",
                success: false
            })
        }
        const hospital = await HospitalService.updateHospital(hospitalId, data);
            res.status(200).send({
                success: true,
                hospital
    })
    }

    // delete the hospital by id
    async deleteHospital(req, res){
       const hospitalId = req.params.hospitalId;
       const foundHospital = await HospitalService.getHospitalById(hospitalId);
       if(!foundHospital){
        return res.status(404).send({
            message: "invalid_id",
            success: false
        })
    }
        const hospital = await HospitalService.deleteHospital(hospitalId);
        return res.status(200).send({
            success:true,
            hospital
        })
    }

    
}
   
  
export default new HospitalController();