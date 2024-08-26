import Joi from "joi"

const createHospitalSchema = Joi.object({
    name: Joi.string(),
    address: Joi.string(),
    contactNumber: Joi.number(),
    email: Joi.string().email(),
    logo: Joi.string()
})

const updateHospitalSchema = Joi.object({
    name: Joi.string(),
    address: Joi.string(),
    contactNumber: Joi.number(),
    email: Joi.string().email(),
    logo: Joi.string()
})

export { createHospitalSchema, updateHospitalSchema } 