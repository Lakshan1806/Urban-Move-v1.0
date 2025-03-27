import React, { useState } from "react";

function EmailForm() {
  const [emailData, setEmailData] = useState({
    recipient: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setEmailData({ ...emailData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/email/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(emailData),
      });

      const result = await response.json();
      alert(result.message);
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-700 text-center mb-6">Send Email</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="email"
            name="recipient"
            placeholder="Recipient Email"
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>
          <input
            type="text"
            name="subject"
            placeholder="Subject"
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>
          <textarea
            name="message"
            placeholder="Message"
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
            rows="6"
          ></textarea>
        </div>
        <div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg hover:bg-gradient-to-l hover:from-indigo-600 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}

export default EmailForm;
