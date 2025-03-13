 const saveSession = (session, res, successMessage) => {
    session.save((err) => {
      if (err) {
        res.status(500).json({ message: "Server error", error: "Session not saved" });
      } else {
        res.status(200).json({ message: successMessage });
      }
    });
  };

  export default saveSession;
  