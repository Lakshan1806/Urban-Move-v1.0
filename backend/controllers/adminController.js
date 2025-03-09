const adminController = {
  login: (req, res) => {
    res.send("login success");
  },

  data: (req, res) => {
    res.send("Sample data");
  },

  root: (req, res) => {
    res.send("Server is ready");
  },
};

export default adminController;
