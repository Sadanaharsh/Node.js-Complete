import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    
       name: {
        type:String,
        required: true,
       }, 
    
}, {timestamps: true});

// Try ki jo first parameter do uss hi naam se import karo.
export const Category = mongoose.model("Category", categorySchema);
