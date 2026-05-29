const express = require("express");

const router = express.Router();

const { auth } =
require("../middlewares/authMiddleware");

const {
    createOrder,
    verifyPayment
}
=
require("../controller/paymentController");

router.post(
    "/create-order",
    auth,
    createOrder
);

router.post(
    "/verify-payment",
    auth,
    verifyPayment
);

module.exports = router;