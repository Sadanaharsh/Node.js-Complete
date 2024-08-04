import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    description: {
        required: true,
        type: String,
    },

    name: {
        required: true,
        type: String
    },
   
    // Waise to hum images or pdfs ko database me store kar sakte hain, but generally inko database me store nahi kiya jaata hai,
    // inhe ya to apne hi server me alag se folder banakar store kiya jaata hai and fir uska public URL use karlete hain, ya fir kisi cloud par store kiya jaata hai.

    // Ek cloudinary service hoti hai jo humari images ko store kar leti hai and then hume uska URL de deti hai.
    productImage: {
        // So hum log apne database me url store karlenge.
        type: String,
    },

    price: {
        type: Number,
        default: 0,
    },

    stock : {
        type: Number,
        default : 0,
    },

    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        red: "User",
        required: true,
    }

}, {timestamps: true});

export const Product = mongoose.model("Product", productSchema);