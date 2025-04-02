import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config({ path: "C:/Users/USER/Videos/Software-Development-Project/.env" });

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

 const phoneMessage = async(phone,body) =>{
    try {
         await client.messages.create({
          from: process.env.TWILIO_PHONE_NUMBER,
          to: phone,
          body:body,
        });
      } catch (error) {
        console.error("Failed to send SMS:", error.message);
        throw error;    
      }
    }; 


export default phoneMessage;