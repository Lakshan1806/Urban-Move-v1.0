import { useEffect, useState, useRef } from "react";
import axios from "axios";
//import { FaRegUserCircle } from "react-icons/fa";
import { PiUserGear } from "react-icons/pi";
import { RiAccountCircleFill } from "react-icons/ri";
import { MdEmail } from "react-icons/md";
import { FaPhone } from "react-icons/fa6";

function AccountInfo() {
  const fileInputRef = useRef(null);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [tempImage, setTempImage] = useState(null);
  const [isEditable, setIsEditable] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [newPassword, setNewPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [currentPassword, setCurrentPassword] = useState(null);

  console.log(imageUrl);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/admin/account_info");
        console.log(response);
        setName(response.data.name);
        setUsername(response.data.username);
        setEmail(response.data.email);
        setPhone(response.data.phone);
        setImageUrl(response.data.photo);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    console.log(imageUrl);
    fetchData();
  }, []);

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const onCancel = () => {
    setIsEditable(false);
  };

  const onEdit = () => {
    setIsEditable(true);
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
  const handleSave = async (e) => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("username", username);
    formData.append("email", email);
    formData.append("phone", phone);

    if (tempImage) {
      formData.append("photo", tempImage);
    }

    try {
      const response = await axios.post("/admin/update_details", formData);
    } catch (error) {
      console.error("Upload failed:", error);
    }
    setIsEditable(false);
  };

  const handleUpdatePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      return;
    }
    if (newPassword !== confirmPassword) {
      return;
    }
    /* if (newPassword.length < 8) {
      return;
    } */

    try {
      //setLoading(true);
      await axios.patch("/admin/change_password", {
        currentPassword,
        newPassword,
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setShowChangePassword(false), 800); // brief success flash
    } catch (err) {
      setStatus({
        type: "error",
        msg:
          err.response?.data?.message ??
          "Something went wrong. Please check your current password and try again.",
      });
    } finally {
      //setLoading(false);
    }
  };

  return (
    <div className="col-span-12 row-span-12 p-4 rounded-xl shadow-[0px_10px_20px_0px_rgba(0,_0,_0,_0.15)] flex flex-col gap-10">
      <div className="flex flex-row justify-center items-center gap-5">
        <img
          src={imageUrl}
          alt="Profile"
          className="w-60 h-60 rounded-full object-cover"
        />
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
        />
        {isEditable ? (
          <div className="button-wrapper">
            <button
              type="button"
              className="button-primary"
              onClick={handleImageClick}
            >
              Upload new photo
            </button>
          </div>
        ) : null}
      </div>
      <p>Personal info</p>
      <div className="flex flex-col">
        <div className="p-4 my-2  rounded-xl shadow-[0px_10px_20px_0px_rgba(0,_0,_0,_0.15)] flex flex-row gap-4 justify-around">
          <div>
            <RiAccountCircleFill className="w-[30px] h-[30px]" />
            {isEditable ? (
              <div className="flex flex-col w-[300px]">
                <label htmlFor="fullname">Full Name</label>
                <input
                  type="text"
                  id="fullname"
                  name="fullname"
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                  value={name}
                />
              </div>
            ) : (
              <div className="w-[300px]">
                <p>Full Name :</p>
                <p>{name}</p>
              </div>
            )}
          </div>
          <div>
            <PiUserGear className="w-[30px] h-[30px]" />
            {isEditable ? (
              <div className="flex flex-col w-[300px]">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  onChange={(e) => {
                    setUsername(e.target.value);
                  }}
                  value={username}
                />
              </div>
            ) : (
              <div className="w-[300px]">
                <p>Username : </p>
                <p>{username}</p>
              </div>
            )}
          </div>
          <div>
            <MdEmail className="w-[30px] h-[30px]" />
            {isEditable ? (
              <div className="flex flex-col w-[300px]">
                <label htmlFor="email">Email</label>
                <input
                  type="text"
                  id="email"
                  name="email"
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  value={email}
                />
              </div>
            ) : (
              <div className="w-[300px]">
                <p>Email :</p>
                <p>{email}</p>
              </div>
            )}
          </div>
          <div>
            <FaPhone className="w-[30px] h-[30px]" />
            {isEditable ? (
              <div className="flex flex-col w-[300px]">
                <label htmlFor="phone">Phone</label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  onChange={(e) => {
                    setPhone(e.target.value);
                  }}
                  value={phone}
                />
              </div>
            ) : (
              <div className="w-[300px]">
                <p>Phone :</p>
                <p>{phone}</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-row items-center justify-center gap-5">
        {isEditable ? (
          <>
            <div className="button-wrapper">
              <button
                type="button"
                className="button-primary"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
            <div className="button-wrapper">
              <button
                type="button"
                className="button-primary"
                onClick={onCancel}
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="button-wrapper w-1/4 ">
              <button type="button" className="button-primary" onClick={onEdit}>
                Edit
              </button>
            </div>
            <div className="button-wrapper w-1/4">
              <button
                type="button"
                className="button-primary"
                onClick={() => setShowChangePassword(true)}
              >
                Change Password
              </button>
            </div>
          </>
        )}
      </div>

      {showChangePassword && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm">
            <h2 className="text-xl font-semibold text-gray-800">
              Change Password
            </h2>
            <label className="block">
              <span className="text-sm text-gray-700">Current password</span>
              <input
                type="password"
                name="current"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-200"
              />
            </label>

            <label className="block">
              <span className="text-sm text-gray-700">New password</span>
              <input
                type="password"
                name="new"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-200"
              />
            </label>

            <label className="block">
              <span className="text-sm text-gray-700">Confirm password</span>
              <input
                type="password"
                name="confirm"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring focus:ring-indigo-200"
              />
            </label>

            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-200 rounded"
                onClick={() => setShowChangePassword(false)}
              >
                Cancel
              </button>
              <div className="button-wrapper">
                <button
                  className="button-primary"
                  onClick={() => {
                    handleUpdatePassword();
                  }}
                >
                  Update Password
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AccountInfo;
