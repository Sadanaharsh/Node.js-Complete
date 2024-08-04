import mongoose from "mongoose";

const hospitalSchema = new mongoose.Schema({}, {timeStamps: true});

export const Hospital = mongoose.model("Hospital", hospitalSchema);