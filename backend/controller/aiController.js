const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI =new GoogleGenerativeAI( process.env.GEMINI_API_KEY);

exports.chatWithAI = async (req,res)=>{

try{ const { prompt } = req.body; 
if(!prompt){ return res.status(400).json({ success:false, message:"Prompt missing" });}

const model =genAI.getGenerativeModel({ model:"gemini-2.0-flash"});

const result = await model.generateContent(prompt);

const response = await result.response;

const text = response.text();

return res.status(200).json({ success:true,reply:text});

}

catch(error){
console.error(error);

return res.status(500).json({success:false, message:"AI Error"});

}

};