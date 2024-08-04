import mongoose from "mongoose"

// Assume that we are making the database for the todolist project.

// Schema ek method hain jo ki ek object leta hai.

// Here we will only learn how to model the data, not to connect with the database.

// In lieman terms assume schema to be as the table or relation.
const userSchema = new mongoose.Schema(
    {
       // iss object ke andar hum userSchema ki saari fields define karenge.
       // userName: String,

       // ya fir hum object banake aur properties ke saath bhi define kar sakte hain.
       userName: {
        type: String,
        required: true,  // Yeh humesha required hi hoga.
        unique: true,    // Yeh humesha unique bhi hoga.
        lowercase: true,
       },

       email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
       },

       password: {
        type: String,
        required: true,
       }
    },
    // Schema banate samay hum ek second field bhi de sakte hain, jisme hum timeStamps(createdAt and updatedAt) dete hain.
    {
        timestamps: true,
    }
)

// Hum mongoose se model banate hain and yeh do parameters leta hai.
// First parameter jiska model banana hai and second parameter on the basis of what schema model banana hai.
export const User = mongoose.model("User", userSchema);

// Jab bhi ye User model database me jayega yeh lowercase aur plural me convert ho jayega.
// User ka users ho jayega.

// Yeh jo above three lines of code likha hai yeh humesha likha hi jayega, schema banane ke liye.
