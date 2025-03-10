import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config({ path: "C:/Users/USER/Videos/Software-Development-Project/.env" });

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);


export default client;