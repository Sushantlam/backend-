const express = require("express")
const app = express()
const {connectMongo}= require("./connect")
const dotenv = require("dotenv")
const cors = require("cors")
const user = require('./route/User');
const fileUpload = require('express-fileupload');
const cookieParser = require("cookie-parser")
dotenv.config()


app.use(cors())
app.use(cookieParser())

app.use(express.json({limit : '90mb'}))
app.use(express.urlencoded({ extended: true }));

app.use(fileUpload({useTempFiles:true}))


connectMongo(process.env.DB_MONGO).then(()=>{
    console.log(`mongo connected ${process.env.DB_MONGO}`)
    app.listen(process.env.PORT, (error)=>{
            if(error) console.log(error);
            console.log(`listening at port ${process.env.PORT}`)
    })
}).catch((error)=>{
    console.log(error);

})


app.use("/api/auth", user )
