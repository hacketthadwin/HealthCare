const jwt = require("jsonwebtoken")
require("dotenv").config();


exports.auth = (req, res, next) => {
    try {
        const token = req.body.token;
        // const token = req.cookie.token 

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "token missing"
            })
        }

        // verify the token 
        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);

            console.log(decode)

            req.user = decode;
        }
        catch (e) {
            return res.status(401).json({
                success: false,
                message: "token is invalid"
            })
        }

        next();
    }
    catch (err) {
        console.log(err)
        return res.status(401).json({
            success: false,
            message: "Something went wrong while verifying token"
        })
    }
}

exports.isDoctor = (req, res, next) => {
    try {
        if (req.user.role !== "Doctor") {
            return res.status(401).json({
                success: false,
                message: "This is a protect route for Doctors, you can not access it"
            })
        }
        next();
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: "User Role is not Matching"
        })
    }
}

exports.isPatient = (req, res, next) => {
    try {
        if (req.user.role !== "Patient") {
            return res.status(401).json({
                success: false,
                message: "This is a protect route for Patients,you can not access it"
            })
        }
        next();
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: "User Role is not Matching"
        })
    }
}