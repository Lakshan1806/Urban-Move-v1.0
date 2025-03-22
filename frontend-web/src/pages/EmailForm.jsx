import React, { useState } from "react";

const EmailForm = () => {
    const [emailData, setEmailData] = useState({
        recipient: "",
        subject: "",
        message: ""
    });
    const [responseMessage, setResponseMessage] = useState("");

    const handleChange = (e) => {
        setEmailData({ ...emailData, [e.target.name]: e.target.value });
    };

    const sendEmail = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:5000/api/send-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(emailData)
            });

            const data = await response.json();
            if (data.success) {
                setResponseMessage("Email sent successfully!");
                setEmailData({ recipient: "", subject: "", message: "" });
            } else {
                setResponseMessage("Failed to send email.");
            }
        } catch (error) {
            setResponseMessage("An error occurred.");
        }
    };

    return (
        <div>
            <h2>Send an Email</h2>
            <form onSubmit={sendEmail}>
                <input
                    type="email"
                    name="recipient"
                    placeholder="Recipient Email"
                    value={emailData.recipient}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="subject"
                    placeholder="Subject"
                    value={emailData.subject}
                    onChange={handleChange}
                    required
                />
                <textarea
                    name="message"
                    placeholder="Message"
                    value={emailData.message}
                    onChange={handleChange}
                    required
                />
                <button type="submit">Send Email</button>
            </form>
            {responseMessage && <p>{responseMessage}</p>}
        </div>
    );
};

export default EmailForm;
