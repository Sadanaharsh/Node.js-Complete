import mongoose from "mongoose";

const medicalRecordSchema = new mongoose.Schema({}, {timeStamps: true});

export const MedicalRecord = mongoose.model("MedicalRecord", medicalRecordSchema);