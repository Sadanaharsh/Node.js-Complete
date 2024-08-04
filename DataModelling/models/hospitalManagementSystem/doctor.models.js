import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    salary: {
        type: Number,
        required: true,
    },
    qualification: {
        type: String,
        required: true,
    },
    experienceInYears: {
        type: Number,
        required: true,
    },
    worksInHospitals: [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: "Hospital",
        },
    ]

    // A doctor can also work in multiple hospitals.

}, {timeStamps: true});

export const Doctor = mongoose.model("Doctor", medicalRecordSchema);