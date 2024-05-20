const userSchema = require("../models/UserMode")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const cloudinary = require("../utils/cloudinary")
const nodemailer = require('nodemailer');


//
async function sendVerifyMail(name, email, u_id){
    try {
        const transport =nodemailer.createTransport({
           
            service: 'gmail',
            port: 587,
            logger: true,
            debug: true,
            secure: true,
           auth:{
                user: 'sushantlama732@gmail.com',
                pass: 'btxp hwvr szin hium'
     },
    tls:{
        rejectUnauthorized:true
    } })
            const mailOptions = {
                from: 'sushantlama732@gmail.com',
                to: email,
                subject: 'For verification email',
                html: '<p>Hello '+ name +' Please click here to <a href="https://fullstack-frontend-green.vercel.app/verify/'+ u_id+'"> Verify </a>at your mail </p>'
     };
     transport.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error.message);
          
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
        
    } catch (error) {
        console.log(error);
    }
}
//create new user
async function createUser(req, res) {
    const { email, password, userName } = req.body;

    try {
        const existingUser = await userSchema.findOne({ email });

        // If the user exists and is already verified, prevent creating a new user
        if (existingUser && existingUser.isVerify) {
            return res.status(400).json("Email is already registered and verified");
        }

        // If the user exists but is not verified, inform the user
        if (existingUser) {
            return res.status(400).json("Email is registered but not verified");
        }
       

        // Hash the password
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        // Upload image to Cloudinary
        const img = await cloudinary.uploader.upload(req.files.images.tempFilePath, { folder: "user" });

        // Create new user
        const newUser = new userSchema({
            email,
            password: hash,
            userName,
            images: {
                public_id: img.public_id,
                url: img.secure_url
            }
        });

        // Save the new user to the database
        const finalUser = await newUser.save();

        // Send verification email
        sendVerifyMail(userName, email, finalUser._id);

        // Send success response
        res.status(201).json({ message: "Please verify your mail and log in " });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json( "Internal server error" );
    }
}


//update the user 
async function updateUser(req, res) {
    console.log(req.params.id);
    const userId = req.params.id;
    const { email, userName } = req.body;
    console.log(email);



    try {

        if (email || userName) {
            const updatedUser = await userSchema.findByIdAndUpdate(userId, {
                email: email,
                userName: userName,

            }, { new: true });
            console.log(updatedUser);

            res.status(200).json({ updatedUser });
        }
        else {
            res.status(201).send("jsonwebtoken")
        }



    } catch (error) {
        res.status(500).json(error.message);
    }
}


//login 
async function loginUser(req, res) {
    try {
        const loginEmail = await userSchema.findOne({ email: req.body.email });
        
        // Check if the user exists
        if (!loginEmail) {
            return res.status(500).send("This email is not registered");
        }

        // Check if the email is verified
        if (!loginEmail.isVerify) {
            return res.status(500).send("This email is not verified");
        }

        // Compare passwords
        const loginPassword = await bcrypt.compare(req.body.password, loginEmail.password);
        if (!loginPassword) {
            return res.status(500).send("Your password is incorrect");
        }

        // Generate JWT token
        const token = jwt.sign({ id: loginEmail._id, isAdmin: loginEmail.isAdmin }, process.env.SECRET, { expiresIn: '7d' });
        const { password, isAdmin, ...otherDetails } = loginEmail._doc;

        // Set the token in a cookie and send response
        res.cookie("access_token", token, { httpOnly: true })
            .status(200)
            .json({ details: { ...otherDetails, isAdmin, token } });
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).send("Internal server error");
    }
}

//getAll

async function getAll(req, res) {
    try {
        const all = await userSchema.find();
        res.status(201).json({ data: all })
    } catch (error) {
        console.log(error);
    }
}

async function getById(req, res) {

    try {
        const oneId = await userSchema.findById(req.params.id);
        res.status(201).json({ data: oneId })
    } catch (error) {
        console.log(error);
    }
}

async function deleteById(req, res) {

    try {
        const oneId = await userSchema.findByIdAndDelete(req.params.id);
        res.status(201).send("Your accound is deleted successfully")
    } catch (error) {
        console.log(error);
    }
}


const verifyEmail = async (req, res) => {
    console.log(req.params.id); // Use req.params.id to access route parameter
    try {
        const updateVerify = await userSchema.updateOne(
            { _id: req.params.id }, // Access route parameter using req.params.id
            { $set: { isVerify: true } },
            { new: true }
        );
        console.log(updateVerify);
        res.render("Email is verified", updateVerify);
    } catch (error) {
        // Handle error appropriately
        console.error("Error verifying email:", error);
        res.status(500).json({ error: "Error verifying email" });
    }
};


module.exports = { createUser, updateUser, loginUser, getAll, getById, deleteById, verifyEmail }