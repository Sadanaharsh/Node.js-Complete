
const express = require('express')
     // OR
// import express from "express"

require('dotenv').config()

const app = express()

// Port define karna padta so that server uss port par listen kar sake.
const port = proc5000

// Iss code ka matlab hai, if home route par koi request aati hai, then app hello world ka response send kardo.
app.get('/', (req, res) => {
  res.send('Hello World!')
})

// hum dusre route par bhi listen kara sakte hain.
app.get("/twitter", (req, res) => {
    res.send("harshdotcom");
})

app.get("/login", (req, res) => {
    res.send("<h1>Please login at chai aur code</h1>");
})

app.listen(process.env.PORT, () => {
  // If successfully listen kar rahe ho then...
  console.log(`Example app listening on port ${port}`)
})

console.log(process.env);


// If server start karne ke baad kuch changes karte hain, then wo changes reflect nahi honge hme server restart karna padega changes ko reflect karne ke liye.
// dotenv inbsert karne ke baad humne code ko production me daal diya hai.

// .gitignore me vo waali files daalna jo ki you don't want to push in the github.