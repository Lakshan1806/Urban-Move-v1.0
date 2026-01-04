import dotenv from "dotenv";
import axios from "axios";
dotenv.config();

const sendSMS = async (phone, messageContent) => {
  try {
    const apiToken = process.env.TEXT_API_TOKEN;
    const senderId = process.env.TEXT_LK_SENDER_ID;
    const endpoint = process.env.TEXT_API_ENDPOINT;

    console.log("Environment check:");
    console.log("- API Token exists:", !!apiToken);
    console.log("- API Token length:", apiToken ? apiToken.length : 0);
    console.log("- Sender ID:", senderId);
    console.log("- Endpoint:", endpoint);

    if (!apiToken || !senderId || !endpoint) {
      console.warn("Missing required environment variables:");
      console.warn("- TEXT_API_TOKEN:", !!apiToken);
      console.warn("- TEXT_LK_SENDER_ID:", !!senderId);
      console.warn("- TEXT_API_ENDPOINT:", !!endpoint);
      return false;
    }

    const payload = {
      api_token: apiToken,
      recipient: phone,
      message: messageContent,
      sender_id: senderId,
    };

    console.log("Request payload:", {
      ...payload,
      api_token: `${apiToken.substring(0, 10)}...`,
    });

    const response = await axios.post(endpoint, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("SMS Response:", response.data);
    return response.data.status === "success";
  } catch (error) {
    console.error("Error sending SMS:");

    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
      console.error("Headers:", error.response.headers);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error message:", error.message);
    }

    return false;
  }
};

export default sendSMS;
