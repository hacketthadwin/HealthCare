const express = require("express");

const router = express.Router();

const { auth, isPatient} = require("../middlewares/authMiddleware");

const { chatWithAI} = require("../controller/aiController");

router.post(    "/chat",    auth,    isPatient,    chatWithAI);

module.exports = router;