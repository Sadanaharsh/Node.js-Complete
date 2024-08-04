import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser';


const app = express();

// cors ka configuration....
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
})); // cors is just cross origin.

// using cors hum yeh bhi define kar sakte hain ki konsa frontend aake humare backened ke server ko access kar sakta hai.
// If cors origin is * then it accepts request from all the frontend servers.

// Now we will do some sort of settings. Jo frontend se data aayega vo bahut forms me aayega eg json.
// So kitna json aayega hum limit lagayenge.
app.use(express.json({limit: "16KB"}));

// express ko yeh bhi batana padega ki jo URL se data aayega usko bhi samajh lena.
app.use(express.urlencoded({extended: true, limit: "16KB"})) // extended ka matlab hai aap objects ke andar objects de sakte ho.

app.use(express.static("public"))  // Kuch files or folders ko hum apne server me store kra lete hain. Public folder humne banaya hua hai.

app.use(cookieParser());


export {app}