import React, { useContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
const Profile = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const fileInputRef = useRef(null);
  const [name, setName] = useState("");
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    fullname: "",
    nicNumber: "",
    address: "",
    age: "",
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [imageUrl, setImageUrl] = useState("default-image.png");
  const [tempImage, setTempImage] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("/auth/profile");
        setProfile(response.data);
        setFormData({
          username: response.data.username || "",
          email: response.data.email || "",
          phone: response.data.phone || "",
          fullname: response.data.fullname || "",
          nicNumber: response.data.nicNumber || "",
          address: response.data.address || "",
          age: response.data.age || "", 
        });
        setImageUrl(response.data.photo);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load profile");
        console.error("Profile error:", err);
      }
    };

    fetchProfile();
  }, [isAuthenticated, navigate]);

  const handleEdit = () => {
    setIsEditing(true);
  };
  const handleImageClick = () => {
    fileInputRef.current.click();
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    } else {
      const previewUrl = URL.createObjectURL(file);
      setImageUrl(previewUrl);
      setTempImage(file);
    }
  };

  const handlePasswordSave = async () => {
    setError(null);

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError("New passwords don't match");
      return;
    }

    try {
      const response = await axios.put("/auth/profile/password", {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
        confirmPassword: passwordForm.confirmPassword,
      });
      if (response.data.success) {
        setIsChangingPassword(false);
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        alert("Password changed successfully");
      } else {
        setError(response.data.message || "Password change failed");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to change password");
      console.error("Password change error:", err);
    }
  };

  const handleSave = async () => {
    console.log("Form data being sent:", formData);

    try {
      const response = await axios.put("/auth/updateprofile", formData);
      setProfile(response.data);
      setIsEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
      console.error("Update profile error:", err);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setIsChangingPassword(false);
    setFormData({
      username: profile?.username || "",
      email: profile?.email || "",
      phone: profile?.phone || "",
    });
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setError(null);
  };

  if (!isAuthenticated) {
    return null;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-md mx-auto p-4 bg-white-900 text-black rounded-lg shadow-lg mt-8">
      <h1 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-[#FFD12E] to-[#FF7C1D] bg-clip-text text-transparent">
        Your Profile
      </h1>

      <div className="flex flex-row">
        <img
          src={imageUrl}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover"
        />
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />

        <div className="bg-black rounded-[50px] flex justify-center px-[22px] py-[5px] text-[20px]">
          <button
            type="button"
            className="font-sans bg-gradient-to-b from-[#FFD12E] to-[#FF7C1D] text-transparent bg-clip-text cursor-pointer "
            onClick={handleImageClick}
          >
            Upload new photo
          </button>
        </div>
      </div>

      {/* Profile Info Section */}
      {!isChangingPassword ? (
        <div className="space-y-4">
          <div className="flex justify-between border-b border-gray-700 pb-2">
            <span className="font-semibold">Fullname:</span>
            {isEditing ? (
              <input
                type="text"
                name="fullname"
                value={formData.fullname || ""}
                onChange={handleChange}
                className="bg-gray-800 text-white px-2 rounded"
              />
            ) : (
              <span>{profile?.fullname || user?.fullname}</span>
            )}
          </div>
          <div className="flex justify-between border-b border-gray-700 pb-2">
            <span className="font-semibold">Username:</span>
            {isEditing ? (
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="bg-gray-800 text-white px-2 rounded"
              />
            ) : (
              <span>{profile?.username || user?.username}</span>
            )}
          </div>

          <div className="flex justify-between border-b border-gray-700 pb-2">
            <span className="font-semibold">Email:</span>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="bg-gray-800 text-white px-2 rounded"
              />
            ) : (
              <span>{profile?.email || user?.email}</span>
            )}
          </div>

          <div className="flex justify-between border-b border-gray-700 pb-2">
            <span className="font-semibold">Phone:</span>
            {isEditing ? (
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="bg-gray-800 text-white px-2 rounded"
              />
            ) : (
              <span>{profile?.phone || user?.phone}</span>
            )}
          </div>
          <div className="flex justify-between border-b border-gray-700 pb-2">
            <span className="font-semibold">NIC Number:</span>
            {isEditing ? (
              <input
                type="text"
                name="nicNumber"
                value={formData.nicNumber || ""}
                onChange={handleChange}
                className="bg-gray-800 text-white px-2 rounded"
              />
            ) : (
              <span>{profile?.nicNumber || user?.nicNumber}</span>
            )}
          </div>
          <div className="flex justify-between border-b border-gray-700 pb-2">
            <span className="font-semibold">Age:</span>
            {isEditing ? (
              <input
                type="text"
                name="age"
                value={formData.age || ""}
                onChange={handleChange}
                className="bg-gray-800 text-white px-2 rounded"
              />
            ) : (
              <span>{profile?.age || user?.age}</span>
            )}
          </div>
          <div className="flex justify-between border-b border-gray-700 pb-2">
            <span className="font-semibold">Address:</span>
            {isEditing ? (
              <input
                type="text"
                name="address"
                value={formData.address || ""}
                onChange={handleChange}
                className="bg-gray-800 text-white px-2 rounded"
              />
            ) : (
              <span>{profile?.address || user?.address}</span>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-col border-b border-gray-700 pb-2">
            <label className="font-semibold mb-1">Current Password:</label>
            <input
              type="password"
              name="currentPassword"
              value={passwordForm.currentPassword}
              onChange={handlePasswordChange}
              className="bg-gray-800 text-white px-2 py-1 rounded"
            />
          </div>

          <div className="flex flex-col border-b border-gray-700 pb-2">
            <label className="font-semibold mb-1">New Password:</label>
            <input
              type="password"
              name="newPassword"
              value={passwordForm.newPassword}
              onChange={handlePasswordChange}
              className="bg-gray-800 text-white px-2 py-1 rounded"
            />
          </div>

          <div className="flex flex-col border-b border-gray-700 pb-2">
            <label className="font-semibold mb-1">Confirm Password:</label>
            <input
              type="password"
              name="confirmPassword"
              value={passwordForm.confirmPassword}
              onChange={handlePasswordChange}
              className="bg-gray-800 text-white px-2 py-1 rounded"
            />
          </div>
        </div>
      )}

      <div className="flex flex-col space-y-4 mt-6">
        {isEditing || isChangingPassword ? (
          <>
            <button
              onClick={isChangingPassword ? handlePasswordSave : handleSave}
              className="py-2 px-4 bg-green-600 text-white font-bold rounded-lg hover:opacity-90 transition disabled:opacity-50 cursor-pointer"
            >
              save
            </button>
            <button
              onClick={handleCancel}
              className="py-2 px-4 bg-gray-600 text-white font-bold rounded-lg hover:opacity-90 transition cursor-pointer"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              onClick={handleEdit}
              className="py-2 px-4 bg-gradient-to-r from-[#FF7C1D] to-[#FFD12E] text-black font-bold rounded-lg hover:opacity-90 transition"
            >
              Edit Profile
            </button>
            <button
              onClick={() => {
                setIsChangingPassword(true);
              }}
              className="py-2 px-4 bg-blue-600 text-white font-bold rounded-lg hover:opacity-90 transition"
            >
              Change Password
            </button>
            <button
              onClick={logout}
              className="py-2 px-4 bg-red-600 text-white font-bold rounded-lg hover:opacity-90 transition"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
