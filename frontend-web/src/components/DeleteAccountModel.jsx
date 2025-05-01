import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const DeleteAccountModal = ({ userId, onClose, onSuccess }) => {
  const [deleteReason, setDeleteReason] = useState("");

  const handleAccountDeletion = async () => {
    try {
      const response = await axios.delete("/auth/delete-account", {
        data: {
          userId,
          reason: deleteReason,
        },
      });

      if (response.data.success) {
        toast.success("Account deleted successfully");

        await onSuccess();
        onClose();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Deletion failed");
    }
  };

  return (
    <div className="fixed inset-0 bg-white bg-opacity-50  flex items-center justify-center p-4">
      <div className="bg-gradient-to-r from-[#FF7C1D] to-[#FFD12E] p-6 rounded-lg max-w-md w-full">
        <h3 className="text-xl font-bold mb-4 text-center">Delete Account</h3>
        <p className="mb-4 text-center">
          This will permanently remove your account. All data will be archived.
        </p>

        <textarea
          placeholder="Reason for deletion (optional)"
          value={deleteReason}
          onChange={(e) => setDeleteReason(e.target.value)}
          className="w-full p-2 border rounded mb-4"
          rows={3}
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleAccountDeletion}
            className="px-4 py-2 bg-red-600 text-white rounded disabled:opacity-50 cursor-pointer"
          >
            confirm deletion
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountModal;
