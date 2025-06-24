const express = require("express");
const { auth } = require("../middlewares/authMiddleware");
const {
  bookAppointment,
  getDoctorAppointments,
  updateAppointmentStatus
} = require("../controller/appointmentController");  // ✅

const router = express.Router();
console.log("bookAppointment:", typeof bookAppointment);
console.log("getDoctorAppointments:", typeof getDoctorAppointments);
console.log("updateAppointmentStatus:", typeof updateAppointmentStatus);


router.post("/book", auth, bookAppointment);  // ✅ Make sure bookAppointment is not undefined
router.get("/doctorappointment", auth, getDoctorAppointments);
router.patch("/:id", auth, updateAppointmentStatus);

module.exports = router;