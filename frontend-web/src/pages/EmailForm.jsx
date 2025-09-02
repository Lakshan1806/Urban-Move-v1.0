import { useState } from "react";

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
      const response = await fetch(
        "http://localhost:5000/api/email/send-email",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(emailData),
        },
      );

      const result = await response.json();
      alert(result.message);
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

  return (
    <div className="mx-auto max-w-lg rounded-lg bg-white p-6 shadow-lg">
      <h2 className="mb-6 text-center text-2xl font-semibold text-gray-700">
        Send Email
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="email"
            name="recipient"
            placeholder="Recipient Email"
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>
        <div>
          <input
            type="text"
            name="subject"
            placeholder="Subject"
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>
        <div>
          <textarea
            name="message"
            placeholder="Message"
            onChange={handleChange}
            required
            className="w-full resize-none rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            rows="6"
          ></textarea>
        </div>
        <div>
          <button
            type="submit"
            className="w-full rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-2 font-semibold text-white hover:bg-gradient-to-l hover:from-indigo-600 hover:to-blue-500 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}

export default EmailForm;
