const Appointment = require("../models/appointmentModel");

// controllers/appointmentController.js

// Book appointment controller
const bookAppointment = async (req, res) => {
  try {

    const { doctorId, reason } = req.body;
    console.log("Received doctorId:", doctorId);
    console.log("Received reason:", reason);
    console.log("Authenticated user:", req.user); // req.user.id should be valid

    if (!doctorId || !reason) {
    return res.status(400).json({ message: "Missing required fields" });
    }


    const newAppointment = await Appointment.create({
      doctorId,
      patientId: req.user.id,  // assuming auth middleware sets req.user
      reason,
    });

    res.status(201).json({ message: "Appointment booked", data: newAppointment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get appointments for doctor
const getDoctorAppointments = async (req, res) => {
  try {
    console.log("--- getDoctorAppointments Called ---");
    console.log("req.user:", req.user); // Check what's in req.user
    // CORRECTED LINE: Use req.user.id instead of req.user._id
    console.log("Doctor ID from token (req.user.id):", req.user.id);

    const appointments = await Appointment.find({ doctorId: req.user.id }).populate("patientId");

    console.log("Query result (appointments):", appointments);
    console.log("Number of appointments found:", appointments.length);

    res.status(200).json({ data: appointments });
  } catch (err) {
    console.error("Error in getDoctorAppointments:", err);
    res.status(500).json({ message: "Server error" });
  }
};



// Update appointment status (optional for now)
const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.status(200).json({ message: "Status updated", data: appointment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Export them
module.exports = {
  bookAppointment,
  getDoctorAppointments,
  updateAppointmentStatus,
};
