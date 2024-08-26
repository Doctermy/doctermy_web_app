import { Router } from "express";
const router = Router();
import HospitalController from "../controllers/hospital.controller.js"
import { createHospitalSchema, updateHospitalSchema } from "../schemas/hospital.schema.js"
import validate from "../middlewares/validate.middleware.js";

// //ENDPOINT -> AUTHENTICATION -> AUTHORIZATION -> VALIDATION -> CONTROLLER METHOD
router.post("/", validate(createHospitalSchema), HospitalController.createHospital)
router.get("/", HospitalController.getAllHospitals)
router.get("/:hospitalId", HospitalController.getHospitalById)
router.patch("/:hospitalId", validate(updateHospitalSchema), HospitalController.updateHospital)
router.delete("/:hospitalId", HospitalController.deleteHospital)

export default router;