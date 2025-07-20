import React, { useContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { DriverAuthContext } from "../context/DriverAuthContext-driver.jsx";
import axios from "axios";
import PhoneVerification from "../components/PhoneVerification.jsx";
import EmailVerification from "../components/EmailVerification";
import useOtpVerification from "../components/hooks/useOtpVerification";
import DeleteAccountModal from "../components/DeleteAccountModel.jsx";

const Profile = () => {
  const { isAuthenticated, user, logout } = useContext(DriverAuthContext);
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationType, setVerificationType] = useState(null);
  const [pendingVerification, setPendingVerification] = useState({
    field: null,
    value: "",
  });
  const [error, setError] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const phoneVerification = useOtpVerification();
  const emailVerification = useOtpVerification();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("/auth/driver/profile");
        setProfile(response.data);
      } catch (err) {
        console.error(err.response?.data?.message || "Failed to load profile");
      }
    };
    if (isAuthenticated) fetchProfile();
  }, [isAuthenticated, navigate]);

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setProfile((prev) => ({ ...prev, photo: previewUrl }));
  };
  const validateSriLankanPhone = (phone) => {
    const phoneRegex = /^(\+94|0)(7[0-9])([0-9]{7})$/;
    return phoneRegex.test(phone);
  };
  const handlePhoneVerify = async () => {
    try {
      if (!validateSriLankanPhone(formData.phone)) {
        throw new Error(
          "Invalid phone number format (0XXXXXXXXX or +94XXXXXXXXX)"
        );
      }
      if (!profile?.phone || profile.phone.replace(/\D/g, "").length < 10) {
        throw new Error("Please enter a valid phone number");
      }
    } catch {
      alert(err.message);
      return;
    }

    try {
      setIsVerifying(true);
      setVerificationType("phone");
      setPendingVerification({ field: "phone", value: profile.phone });

      await phoneVerification.sendOtp("/auth/send-otp", {
        phone: profile.phone,
        type: "phone",
        userId: profile?._id,
      });
    } catch (error) {
      console.error("Failed to send OTP");
      setIsVerifying(false);
    }
  };

  const handleEmailVerify = async () => {
    if (!profile?.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
      console.error("Please enter a valid email address");
      return;
    }

    try {
      setIsVerifying(true);
      setVerificationType("email");
      setPendingVerification({ field: "email", value: profile.email });

      await emailVerification.sendOtp("/auth/send-otp", {
        email: profile.email,
        type: "email",
        userId: profile?._id,
      });
    } catch (error) {
      console.error("Failed to send OTP");
      setIsVerifying(false);
    }
  };

  const completeVerification = async () => {
    try {
      let verificationResult;

      if (verificationType === "phone") {
        verificationResult = await phoneVerification.verifyOtp(
          "/auth/verify-otp",
          {
            phone: pendingVerification.value,
            otp: phoneVerification.otp,
            type: "phone",
          }
        );
      } else {
        verificationResult = await emailVerification.verifyOtp(
          "/auth/verify-otp",
          {
            email: pendingVerification.value,
            otp: emailVerification.otp,
            type: "email",
          }
        );
      }

      if (verificationResult.success) {
        console.log("Verification successful!");
        setIsVerifying(false);
        setVerificationType(null);
        setPendingVerification({ field: null, value: "" });
      }
    } catch (error) {
      console.error(error.response?.data?.message || "Verification failed");
    }
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("userId", profile?._id);
      formData.append("fullname", profile?.fullname || "");
      formData.append("username", profile?.username || "");
      formData.append("email", profile?.email || "");
      formData.append("phone", profile?.phone || "");
      formData.append("nicNumber", profile?.nicNumber || "");
      formData.append("address", profile?.address || "");
      formData.append("age", profile?.age || "");
      formData.append("carColor", profile?.carColor || "");
      formData.append("carNumber", profile?.carNumber || "");

      if (fileInputRef.current?.files[0]) {
        formData.append("photo", fileInputRef.current.files[0]);
      }

      const response = await axios.post("/auth/driver/updateprofile", formData);
      setIsEditing(false);
      console.log("Profile updated successfully");
    } catch (error) {
      console.error(
        error.response?.data?.message || "Failed to update profile"
      );
    }
  };

  const changePassword = async () => {
    setError(null);
    if (
      !passwordForm.currentPassword ||
      !passwordForm.newPassword ||
      !passwordForm.confirmPassword
    ) {
      setError("All fields are required.");
      return false;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError("New passwords don't match");
      return false;
    }
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (!strongPasswordRegex.test(passwordForm.newPassword)) {
      setError(
        "Password must be at least 6 characters and include: uppercase, lowercase, number, and special character"
      );
      return false;
    }
    try {
      const response = await axios.put(
        "/auth/driver/profile/password",
        passwordForm
      );
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to change password");
      throw err;
    }
  };

  const handleCancel = () => {
    if (isVerifying) {
      setIsVerifying(false);
      setVerificationType(null);
      setPendingVerification({ field: null, value: "" });
    } else if (isChangingPassword) {
      setIsChangingPassword(false);
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } else {
      setIsEditing(false);
      axios
        .get("/auth/driver/profile")
        .then((response) => setProfile(response.data))
        .catch((err) => console.error("Failed to reset changes"));
    }
  };
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handlePasswordSave = async () => {
    try {
      await changePassword();
      setIsChangingPassword(false);
      console.log("Password changed successfully");
    } catch (err) {
      console.error(err.response?.data?.message || "Failed to change password");
    }
  };
  const handleDeleteSuccess = async () => {
    await logout();
    navigate("/");
  };

  if (!profile) return;

  if (isVerifying) {
    return (
      <div className="flex flex-col items-center justify-center py-40">
        {verificationType === "phone" ? (
          <PhoneVerification
            title="Verify your Phone Number"
            description={`We sent a code to ${pendingVerification.value}`}
            onContinue={completeVerification}
            onResend={() =>
              phoneVerification.resendOtp("/auth/resend-otp", {
                phone: pendingVerification.value,
                type: "phone",
              })
            }
            isActive={phoneVerification.isActive}
            secondsLeft={phoneVerification.secondsLeft}
            error={phoneVerification.error}
            onOtpSubmit={phoneVerification.setOtp}
          />
        ) : (
          <EmailVerification
            title="Verify your Email Address"
            description={`We sent a code to ${pendingVerification.value}`}
            onContinue={completeVerification}
            onResend={() =>
              emailVerification.resendOtp("/auth/resend-otp", {
                email: pendingVerification.value,
                type: "email",
              })
            }
            isActive={emailVerification.isActive}
            secondsLeft={emailVerification.secondsLeft}
            error={emailVerification.error}
            onOtpSubmit={emailVerification.setOtp}
          />
        )}
        <div className="button-wrapper">
          <button
            type="button"
            className="button-primary"
            onClick={handleCancel}
          >
            Cancel Verification
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white-900 text-black rounded-lg shadow-md  mt-8 border border-gray-200">
      <div className="flex items-center mb-6">
        <h1 className="[-webkit-text-stroke:1px_rgb(255,124,29)] font-[700] text-[36px] flex-none">
          Account
        </h1>
      </div>

      <div className="flex items-center justify-center mb-6">
        <div className="relative">
          <img
            src={
              profile?.photo
                ? profile.photo.includes("http")
                  ? profile.photo
                  : `http://localhost:5000${profile.photo}`
                : "/default-user.png"
            }
            alt="Profile"
            className="w-40 h-40 rounded-full object-cover border-2 border-orange-500"
          />
          {isEditing && (
            <div className="absolute bottom-0 right-0 button-wrapper">
              <button
                type="button"
                className="button-primary"
                onClick={handleImageClick}
              >
                change
              </button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
                accept="image/*"
              />
            </div>
          )}
        </div>
      </div>

      {!isChangingPassword ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="shadow-md hover:shadow-lg transition-shadow rounded-lg p-1 bg-white border border-gray-300">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="fullname"
                    value={profile.fullname || ""}
                    onChange={(e) =>
                      setProfile({ ...profile, fullname: e.target.value })
                    }
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border"
                  />
                ) : (
                  <div className="mt-1 p-2 text-gray-900">
                    {profile.fullname || "-"}
                  </div>
                )}
              </div>

              <div className="shadow-md hover:shadow-lg transition-shadow rounded-lg p-1 bg-white border border-gray-300">
                <label className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="username"
                    value={profile.username || ""}
                    onChange={(e) =>
                      setProfile({ ...profile, username: e.target.value })
                    }
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border"
                  />
                ) : (
                  <div className="mt-1 p-2">{profile.username || "-"}</div>
                )}
              </div>

              <div className="shadow-md hover:shadow-lg transition-shadow rounded-lg p-1 bg-white border border-gray-300">
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                {isEditing ? (
                  <div className="flex gap-2">
                    <input
                      type="email"
                      name="email"
                      value={profile.email || ""}
                      onChange={(e) =>
                        setProfile({ ...profile, email: e.target.value })
                      }
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border"
                    />
                    {profile.email !== user?.email && (
                      <div className="button-wrapper">
                        <button
                          type="button"
                          className="button-primary"
                          onClick={handleEmailVerify}
                        >
                          verify
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="mt-1 p-2">{profile.email || "-"}</div>
                )}
              </div>
              <div className="shadow-md hover:shadow-lg transition-shadow rounded-lg p-1 bg-white border border-gray-300">
                <label className="block text-sm font-medium text-gray-700">
                  Car Color
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="carColor"
                    value={profile.carColor || ""}
                    onChange={(e) =>
                      setProfile({ ...profile, carColor: e.target.value })
                    }
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border"
                  />
                ) : (
                  <div className="mt-1 p-2">{profile.carColor || "-"}</div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="shadow-md hover:shadow-lg transition-shadow rounded-lg p-1 bg-white border border-gray-300">
                <label className="block text-sm font-medium text-gray-700">
                  Phone
                </label>
                {isEditing ? (
                  <div className="flex gap-2">
                    <input
                      type="tel"
                      name="phone"
                      value={profile.phone || ""}
                      onChange={(e) =>
                        setProfile({ ...profile, phone: e.target.value })
                      }
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border"
                    />
                    {profile.phone !== user?.phone && (
                      <div className="button-wrapper">
                        <button
                          type="button"
                          className="button-primary"
                          onClick={handlePhoneVerify}
                        >
                          verify
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="mt-1 p-2">{profile.phone}</div>
                )}
              </div>

              <div className="shadow-md hover:shadow-lg transition-shadow rounded-lg p-1 bg-white border border-gray-300">
                <label className="block text-sm font-medium text-gray-700">
                  NIC Number
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="nicNumber"
                    value={profile.nicNumber || ""}
                    onChange={(e) =>
                      setProfile({ ...profile, nicNumber: e.target.value })
                    }
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border"
                  />
                ) : (
                  <div className="mt-1 p-2">{profile.nicNumber || "-"}</div>
                )}
              </div>

              <div className="shadow-md hover:shadow-lg transition-shadow rounded-lg p-1 bg-white border border-gray-300">
                <label className="block text-sm font-medium text-gray-700">
                  Age
                </label>
                {isEditing ? (
                  <input
                    type="number"
                    name="age"
                    value={profile.age || ""}
                    onChange={(e) =>
                      setProfile({ ...profile, age: e.target.value })
                    }
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border"
                  />
                ) : (
                  <div className="mt-1 p-2">{profile.age || "-"}</div>
                )}
              </div>

              <div className="shadow-md hover:shadow-lg transition-shadow rounded-lg p-1 bg-white border border-gray-300">
                <label className="block text-sm font-medium text-gray-700">
                  Car Number
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="carNumber"
                    value={profile.carNumber || ""}
                    onChange={(e) =>
                      setProfile({ ...profile, carNumber: e.target.value })
                    }
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border"
                  />
                ) : (
                  <div className="mt-1 p-2">{profile.carNumber || "-"}</div>
                )}
              </div>
            </div>
          </div>

          <div className="shadow-md hover:shadow-lg transition-shadow rounded-lg p-1 bg-white border border-gray-300 mt-4">
            <label className="block text-sm font-medium text-gray-700">
              Address
            </label>
            {isEditing ? (
              <input
                type="text"
                name="address"
                value={profile.address || ""}
                onChange={(e) =>
                  setProfile({ ...profile, address: e.target.value })
                }
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border"
              />
            ) : (
              <div className="mt-1 p-2">{profile.address || "-"}</div>
            )}
          </div>
        </>
      ) : (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold mb-4">Change Password</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Current Password:
              </label>
              <input
                type="password"
                name="currentPassword"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                New Password:
              </label>
              <input
                type="password"
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Confirm Password:
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border"
              />
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-row space-x-4 mt-6 justify-baseline">
        {isEditing || isChangingPassword ? (
          <>
            <div className="button-wrapper">
              <button
                type="button"
                className="button-primary"
                onClick={isChangingPassword ? handlePasswordSave : handleSave}
              >
                Save
              </button>
            </div>

            <div className="button-wrapper">
              <button
                type="button"
                className="button-primary"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
            {isEditing && (
              <div className="button-wrapper">
                <button
                  type="button"
                  className="button-primary"
                  onClick={() => setShowDeleteModal(true)}
                >
                  Delete Account
                </button>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="button-wrapper">
              <button
                type="button"
                className="button-primary"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </button>
            </div>

            <div className="button-wrapper">
              <button
                type="button"
                className="button-primary"
                onClick={() => setIsChangingPassword(true)}
              >
                Change Password
              </button>
            </div>
          </>
        )}
      </div>

      {showDeleteModal && (
        <DeleteAccountModal
          userId={profile?._id}
          onClose={() => setShowDeleteModal(false)}
          onSuccess={handleDeleteSuccess}
        />
      )}
    </div>
  );
};

export default Profile;
