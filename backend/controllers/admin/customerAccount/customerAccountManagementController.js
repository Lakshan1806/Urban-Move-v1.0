import User from "../../../models/usermodel.js";
import jwt from "jsonwebtoken";

const userAccountManagementController = {
  getAllUser: async (req, res) => {
    const { token } = req.cookies;
    if (token) {
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, {}, (err, user) => {
        if (err) {
          return res.status(403).json({ error: "Token verification failed" });
        }
      });
    }
    const users = await User.find().select({
      username: 1,
      phone: 1,
      email: 1,
      photo: 1,
      avatar: 1,
      authMethod: 1,
      isTerminated: 1,
      isAccountVerified: 1,
    });

    users.map((user) => {
      //console.log(user.photo);
      if (user.photo) {
        user.photo = user.photo
          .replace(/\\/g, "/")
          .replace("backend/uploads", "/uploads");
      }
    });

    res.json(users);
  },
};

export default userAccountManagementController;
