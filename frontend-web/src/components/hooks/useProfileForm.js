import { useState, useEffect } from "react";
import axios from "axios";

const useProfileForm = (initialProfile) => {
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
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialProfile) {
      setFormData({
        username: initialProfile.username || "",
        email: initialProfile.email || "",
        phone: initialProfile.phone || "",
        fullname: initialProfile.fullname || "",
        nicNumber: initialProfile.nicNumber || "",
        address: initialProfile.address || "",
        age: initialProfile.age || "",
      });
    }
  }, [initialProfile]);

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

  const saveProfile = async () => {
    setError(null);
    try {
      const response = await axios.put("/auth/updateprofile", formData);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
      throw err;
    }
  };

  const changePassword = async () => {
    setError(null);

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError("New passwords don't match");
      return false;
    }

    try {
      const response = await axios.put("/auth/profile/password", passwordForm);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to change password");
      throw err;
    }
  };

  return {
    formData,
    passwordForm,
    error,
    handleChange,
    handlePasswordChange,
    saveProfile,
    changePassword,
    setFormData,
    setPasswordForm,
    setError,
  };
};

export default useProfileForm;
