import React from "react";
import { useState, useEffect } from "react";
const EditableField = ({
  label,
  name,
  value,
  onChange,
  isEditing,
  type = "text",
  placeholder = "",
  required = false,
  className = "",
  onSave,
  showSaveButton = false,
  needsVerification = false,
  onVerify,
  isVerifying = false,
}) => {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (e) => {
    setLocalValue(e.target.value);
    onChange(e);
  };

  return (
    <div
      className={`flex justify-between border-b border-gray-700 pb-2 ${className}`}
    >
      {isEditing ? (
        <div className="flex items gap-2">
          <input
            type={type}
            name={name}
            value={localValue || ""}
            onChange={handleChange}
            placeholder={placeholder}
            required={required}
            className="bg-gray-800 text-white px-2 rounded "
            disabled={isVerifying}
          />
          {/* Show verify button instead of save for sensitive fields */}
          {needsVerification ? (
              <div className="bg-black rounded-[30px] flex justify-center px-[22px] py-[5px] mx-2 text-[20px]">
            <button
              type="button"
              onClick={onVerify}
              disabled={isVerifying}
              className={`px-2 py-1 rounded text-sm ${
                isVerifying
                  ? "bg-gray-500 cursor-not-allowed"
                  : "font-sans bg-gradient-to-b from-[#FFD12E] to-[#FF7C1D] text-transparent bg-clip-text cursor-pointer"
              } `}
            >
              {isVerifying ? "Verifying..." : "Verify"}
            </button>
            </div>
          ) : showSaveButton ? (
            <button
              type="button"
              onClick={onSave}
              className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-sm"
            >
              Save
            </button>
          ) : null}
        </div>
      ) : (
        <span>{value || "-"}</span>
      )}
    </div>
  );
};

export default EditableField;
