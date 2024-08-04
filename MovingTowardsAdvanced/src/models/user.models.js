// user ke andar id hum nahi likhenge, because mongoDB jaise hi kisi relation ko save karta hai, id generate karta hai.
// avatar and cover image hum ek third party service me store karenge, and database me hum sirf uska url store karenge.
import mongoose, {Schema} from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
    {
        userName: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true   // If kisi bhi field ko searchable banana hai, then uska index true kardo.
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            
        },

        fullName: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
            index: true
        },

        avatar: {
            type: String,  // cloudinary ki service ko use karenge.
            required: true,
        },

        coverImage: {
            type: String,  // cloudinary ki service ko use karenge.
        },

        watchHistory: [
            {
                type: Schema.Types.ObjectId,
                ref: "Video"
            }
        ],

        // Note -> hamesha database me password encrypted form me rakha jaata hai.

        password: {
            type: String,
            required: [true, "Password is required"],   // hum custom error message bhi de sakte hain.
        },

        refreshToken : {
            type: String
        },

        accessToken : {
            type: String
        }

    }, {
        timestamps: true
    }
)

// Now we will encrypt the data before it gets stored in the database. 
// In the middleware of the mongoose we get pre hooks, that works before the data gets stored in the database.

// Jaise uss tarah ke kuch methods hote hain n app.listen(), app.onError(), like that only userSchema.pre()

// console.log(this, '.........................use of this keyword');

// save jaise ese hi kayi saare events hote hain.
// here we can't use the arrow function, because the arrow function does'nt have the access of this.
userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();  // Jab password modify ho rha hai, tabhi we want ki wo hash hokar database me save ho.
    // second parameter hota hai ki kitne rounds lagau, and first parameter me hum password pass karte hain, jisse hume encrupt karna hai.
    this.password = await bcrypt.hash(this.password, 10);
    next()
})

// mongoose ke andar kuch pre defined methods hai, jaise ki updateOne , deleteOne etc.
// We can also add our custom methods.

userSchema.methods.isPasswordCorrect =  function(password){
    // bcrypt library hash bhi karti and password check bhi kar sakti hai.

    // first parameter is the password and the second parameter is the encrypted password.
    return  bcrypt.compare(password, this.password);
}

// Note -> jwt is the bearer token, jiske paas bhi token(chaabi) hogi wo lock ko khol sakta hai.
// humne access token, refresh token and unn dono ki expiries .env file me likh di hain.
// And also note one more thing that hum only refresh token database me store karayenge, not the access token, for that we will use sessions and cookies.

// access token and refresh token both are jwt tokens.

userSchema.methods.generateAccessToken = async function(){
    return jwt.sign(
        {
        _id: this._id,
        email: this.email,
        username: this.userName,
        fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = async function(){
    return jwt.sign(
        {
        _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema);
