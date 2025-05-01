import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import useProfileForm from "../components/hooks/useProfileForm";
import EditableField from "../components/EditableField";
import ImageUploader from "../components/ImageUploder.jsx";
import PhoneVerification from "../components/phoneVerification.jsx";
import EmailVerification from "../components/EmailVerification";
import useOtpVerification from "../components/hooks/useOtpVerification";
import DeleteAccountModal from "../components/DeleteAccountModel.jsx";

const Profile = () => {
  const { isAuthenticated, user, logout, updateProfile } =
    useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationType, setVerificationType] = useState(null);
  const [tempValue, setTempValue] = useState("");
  const [pendingVerification, setPendingVerification] = useState({
    field: null,
    value: "",
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const navigate = useNavigate();

  const {
    otp,
    setOtp,
    error: phoneError,
    secondsLeft: phoneSecondsLeft,
    isActive: isPhoneActive,
    sendOtp: sendPhoneOtp,
    verifyOtp: verifyPhoneOtp,
    resendOtp: resendPhoneOtp,
  } = useOtpVerification();

  const {
    emailOtp,
    setEmailOtp,
    error: emailError,
    secondsLeft: emailSecondsLeft,
    isActive: isEmailActive,
    sendOtp: sendEmailOtp,
    verifyOtp: verifyEmailOtp,
    resendOtp: resendEmailOtp,
  } = useOtpVerification();

  const {
    formData,
    passwordForm,
    formError,
    handleChange,
    handlePasswordChange,
    saveProfile,
    changePassword,
    setFormData,
  } = useProfileForm(profile);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("/auth/profile");
        setProfile(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load profile");
      }
    };

    if (isAuthenticated) fetchProfile();
    else {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const handleEdit = () => setIsEditing(true);

  const handleSave = async () => {
    try {
      const updatedFields = {
        fullname: formData.fullname,
        username: formData.username,
        nicNumber: formData.nicNumber,
        address: formData.address,
        age: formData.age,
        email:
          pendingVerification.field === "email"
            ? pendingVerification.value
            : profile?.email,
        phone:
          pendingVerification.field === "phone"
            ? pendingVerification.value
            : profile?.phone,
      };

      await updateProfile(updatedFields);
      if (pendingVerification.field) {
        setIsVerifying(true);
        setVerificationType(pendingVerification.field);
      } else {
        setIsEditing(false);
        toast.success("Profile updated successfully");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    }
  };

  const handleEmailChange = async (newEmail) => {
    if (newEmail === profile?.email) return;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      return;
    }

    setTempValue(newEmail);
    setVerificationType("email");
    setIsVerifying(true);
    try {
      await sendEmailOtp("/auth/send-otp", { email: newEmail, type: "email" });
    } catch (error) {
      toast.error("Failed to send OTP");
      setIsVerifying(false);
    }
  };

  const handlePhoneChange = async (newPhone) => {
    if (newPhone === profile?.phone) return;

    if (newPhone.replace(/\D/g, "").length < 10) {
      return;
    }

    setTempValue(newPhone);
    setVerificationType("phone");
    setIsVerifying(true);
    try {
      await sendPhoneOtp("/auth/send-otp", {
        phone: newPhone,
        type: "phone",
        userId: user?._id,
      });
    } catch (error) {
      toast.error("Failed to send OTP");
      setIsVerifying(false);
      console.error("OTP send error:", error.response?.data);
    }
  };

  const handleVerifyClick = (field) => {
    if (field === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        toast.error("Please enter a valid email address");
        return;
      }
    } else if (field === "phone") {
      if (formData.phone.replace(/\D/g, "").length < 10) {
        toast.error("Please enter a valid phone number");
        return;
      }
    }
    setPendingVerification({
      field,
      value: formData[field],
    });

    if (field === "phone") {
      handlePhoneChange(formData.phone);
    } else {
      handleEmailChange(formData.email);
    }
  };

  const verifyAndUpdate = async () => {
    try {
      let verificationResult;

      if (verificationType === "email") {
        verificationResult = await verifyEmailOtp("/auth/verify-otp", {
          email: pendingVerification.value,
          otp: emailOtp,
          type: "email",
        });
      } else {
        verificationResult = await verifyPhoneOtp("/auth/verify-otp", {
          phone: pendingVerification.value,
          otp,
          type: "phone",
        });
      }

      if (verificationResult.success) {
        const updatedFields = {
          ...formData,
          [verificationType]: pendingVerification.value,
        };
        await updateProfile(updatedFields);

        setIsVerifying(false);
        setVerificationType(null);
        setTempValue("");
        setOtp("");
        setEmailOtp("");
        toast.success("Profile updated successfully");

        const response = await axios.get("/auth/profile");
        setProfile(response.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Verification failed");
      setOtp("");
      setEmailOtp("");
    }
  };

  const handlePasswordSave = async () => {
    try {
      await changePassword();
      setIsChangingPassword(false);
      toast.success("Password changed successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to change password");
    }
  };

  const handleCancel = () => {
    if (isVerifying) {
      setIsVerifying(false);
      setVerificationType(null);
      setPendingVerification({ field: null, value: "" });
    } else {
      setIsEditing(false);
      setFormData({
        username: profile?.username || "",
        email: profile?.email || "",
        phone: profile?.phone || "",
        fullname: profile?.fullname || "",
        nicNumber: profile?.nicNumber || "",
        address: profile?.address || "",
        age: profile?.age || "",
      });
    }
    setError(null);
  };

  const handleImageUpload = async (file) => {
    try {
      const formData = new FormData();
      formData.append("photo", file);

      const response = await axios.put("/auth/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setProfile(response.data);
      toast.success("Profile photo updated successfully");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to upload photo");
      toast.error("Failed to upload photo");
    }
  };

  const handleDeleteSuccess = async () => {
    await logout();
    navigate("/");
  };

  if (!isAuthenticated) return null;

  if (isVerifying) {
    return (
      <div className="flex flex-col items-center justify-center  py-40 ">
        {verificationType === "phone" ? (
          <PhoneVerification
            title="Verify your new Phone Number"
            description={`We sent a code to ${pendingVerification.value}`}
            onContinue={verifyAndUpdate}
            onResend={() =>
              resendPhoneOtp("/auth/resend-otp", {
                phone: pendingVerification.value,
                type: "phone",
              })
            }
            isActive={isPhoneActive}
            secondsLeft={phoneSecondsLeft}
            error={phoneError}
            onOtpSubmit={setOtp}
          />
        ) : (
          <EmailVerification
            title="Verify your new Email Address"
            description={`We sent a code to ${pendingVerification.value}`}
            onContinue={verifyAndUpdate}
            onResend={() =>
              resendEmailOtp("/auth/resend-otp", {
                email: pendingVerification.value,
                type: "email",
              })
            }
            isActive={isEmailActive}
            secondsLeft={emailSecondsLeft}
            error={emailError}
            onOtpSubmit={setEmailOtp}
          />
        )}
        <button
          onClick={handleCancel}
          className="mt-8 px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
        >
          Cancel Verification
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-4 bg-white-900 text-black rounded-lg shadow-lg mt-8">
      <h1 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-[#FFD12E] to-[#FF7C1D] bg-clip-text text-transparent">
        Your Profile
      </h1>

      <ImageUploader
        initialImage={profile?.photo}
        onImageChange={handleImageUpload}
        className="mb-6"
      />

      {!isChangingPassword ? (
        <div className="space-y-4">
          <EditableField
            label="Fullname"
            name="fullname"
            value={formData.fullname}
            onChange={handleChange}
            isEditing={isEditing}
          />
          <EditableField
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            isEditing={isEditing}
          />
          <EditableField
            label="Email"
            name="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            isEditing={isEditing}
            type="email"
            needsVerification={isEditing && formData.email !== profile?.email}
            onVerify={() => handleVerifyClick("email")}
            isVerifying={isVerifying && verificationType === "email"}
          />
          <EditableField
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            isEditing={isEditing}
            type="tel"
            needsVerification={isEditing && formData.phone !== profile?.phone}
            onVerify={() => handleVerifyClick("phone")}
            isVerifying={isVerifying && verificationType === "phone"}
          />
          <EditableField
            label="NIC Number"
            name="nicNumber"
            value={formData.nicNumber}
            onChange={handleChange}
            isEditing={isEditing}
          />
          <EditableField
            label="Age"
            name="age"
            value={formData.age}
            onChange={handleChange}
            isEditing={isEditing}
            type="number"
          />
          <EditableField
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            isEditing={isEditing}
          />
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

      {(error || formError) && (
        <div className="text-red-500 text-center my-4">
          {error || formError}
        </div>
      )}

      <div className="flex flex-col space-y-4 mt-6">
        {isEditing || isChangingPassword || isVerifying ? (
          <>
            {!isVerifying && (
              <button
                onClick={isChangingPassword ? handlePasswordSave : handleSave}
                className="py-2 px-4 bg-green-600 text-white font-bold rounded-lg hover:opacity-90 transition disabled:opacity-50 cursor-pointer"
              >
                Save
              </button>
            )}
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
              className="py-2 px-4 bg-gradient-to-r from-[#FF7C1D] to-[#FFD12E] text-black font-bold rounded-lg hover:opacity-90 transition cursor-pointer"
            >
              Edit Profile
            </button>
            <button
              onClick={() => setIsChangingPassword(true)}
              className="py-2 px-4 bg-blue-600 text-white font-bold rounded-lg hover:opacity-90 transition cursor-pointer"
            >
              Change Password
            </button>

            <button
              onClick={() => setShowDeleteModal(true)}
              className="py-2 px-4 bg-red-600 text-white font-bold rounded-lg hover:opacity-90 transition cursor-pointer"
            >
              Delete Account
            </button>
            <button
              onClick={logout}
              className="py-2 px-4 bg-red-600 text-white font-bold rounded-lg hover:opacity-90 transition cursor-pointer"
            >
              Logout
            </button>
          </>
        )}
      </div>
      {showDeleteModal && (
        <DeleteAccountModal
          userId={user?._id}
          onClose={() => setShowDeleteModal(false)}
          onSuccess={handleDeleteSuccess}
        />
      )}
    </div>
  );
};

export default Profile;
