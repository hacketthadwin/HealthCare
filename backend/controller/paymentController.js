const razorpay = require("../config/paymentConfig");
const Payment = require("../models/payment");
const User = require("../models/userModel");
const crypto = require("crypto");

exports.createOrder = async (req, res) => {
    try {
        const { amount } = req.body;
        if (!amount || amount <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid amount"
            });
        }
        const options = {
            amount: amount * 100,
            currency: "INR",
            receipt: `receipt_${Date.now()}`
        };
        const order =
            await razorpay.orders.create(
                options
            );
        return res.status(200).json(order);
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

exports.verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            amount,
            role
        } = req.body;
        const expectedSignature =
            crypto
                .createHmac(
                    "sha256",
                    process.env.RAZORPAY_KEY_SECRET
                )
                .update(
                    `${razorpay_order_id}|${razorpay_payment_id}`
                )
                .digest("hex");
        if (
            expectedSignature !==
            razorpay_signature
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid payment"
            });
        }
        const payment =
            await Payment.create({
                user: req.user.id,
                role,
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature,
                amount,
                status: "paid"
            });
        await User.findByIdAndUpdate(
            req.user.id,
            {
                subscription: "Premium"
            }
        );

        return res.status(200).json({
            success: true,
            message:
                "Payment verified successfully",
            payment
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};