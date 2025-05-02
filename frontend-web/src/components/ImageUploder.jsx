import React, { useRef, useState } from "react";

const ImageUploader = ({
  initialImage = "default-image.png",
  onImageChange,
  className = "",
  buttonClassName = "",
  imageClassName = "w-40 h-40 rounded-full object-cover",
}) => {
  const fileInputRef = useRef(null);
  const [imageUrl, setImageUrl] = useState(initialImage);
  const [tempImage, setTempImage] = useState(null);

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setImageUrl(previewUrl);
    setTempImage(file);
    if (onImageChange) onImageChange(file);
  };

  return (
    <div className={`flex flex-row items-center ${className}`}>
      <img
        src={imageUrl}
        alt="Profile"
        className={imageClassName}
        onClick={handleImageClick}
      />
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
        accept="image/*"
      />

      <div className={`bg-black rounded-[50px] flex justify-center px-[22px] py-[5px] mx-2 text-[20px] ${buttonClassName}`}>
        <button
          type="button"
          className="font-sans bg-gradient-to-b from-[#FFD12E] to-[#FF7C1D] text-transparent bg-clip-text cursor-pointer"
          onClick={handleImageClick}
        >
          Upload new photo
        </button>
      </div>
    </div>
  );
};

export default ImageUploader;