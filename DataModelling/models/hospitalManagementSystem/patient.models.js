import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    diagnosed: {
        type: String,
        required: true,
    },

    age: {
        type: String,
        required: true,
    },

    bloodGroup: {
        type: String,
        required: true,
    },

    gender: {
        type: String,
        enum: ["M", "F", "O"],
        required: true,
    },

    hospital: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hospital",
    }
}, {timeStamps: true});

export const Patient = mongoose.model("Patient", patientSchema);