import {Schema, model} from "mongoose";

const hospitalSchema = new Schema({
    name:{
        type: String,
        // required: true,
        unique: true,
        trim: true
    },
    address:{
        type:String,
        // required: true,
        unique: false,
        trim: true
    },
    contactNumber:{
        type: Number,
        // required: true, 
    },
    email:{
        type:String,
        unique: true,
        trim: true,
        // required: true,

    },
   
    logo:{
        type: String,
        // required: true,
        unique: true
    },
},
{ versionKey: false })

const HospitalModel = new model("hospital", hospitalSchema);
export default HospitalModel;