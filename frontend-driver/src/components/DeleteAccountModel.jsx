import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const DeleteAccountModal = ({ userId, onClose, onSuccess }) => {
  const [deleteReason, setDeleteReason] = useState("");

  const handleAccountDeletion = async () => {
    try {
      const response = await axios.delete("/auth/driver/delete-account", {
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
    <div className="bg-opacity-50 fixed inset-0 flex items-center justify-center bg-white p-4">
      <div className="w-full max-w-md rounded-lg bg-gradient-to-r from-[#FF7C1D] to-[#FFD12E] p-6">
        <h3 className="mb-4 text-center text-xl font-bold">Delete Account</h3>
        <p className="mb-4 text-center">
          This will permanently remove your account. All data will be archived.
        </p>

        <textarea
          placeholder="Reason for deletion (optional)"
          value={deleteReason}
          onChange={(e) => setDeleteReason(e.target.value)}
          className="mb-4 w-full rounded border p-2"
          rows={3}
        />

        <div className="flex justify-end gap-2">
          <div
            className={`mx-2 flex justify-center rounded-[50px] bg-black px-[22px] py-[5px] text-[20px]`}
          >
            <button
              onClick={onClose}
              className="cursor-pointer bg-gradient-to-b from-[#FFD12E] to-[#FF7C1D] bg-clip-text font-sans text-transparent"
            >
              Cancel
            </button>
          </div>
          <div
            className={`mx-2 flex justify-center rounded-[50px] bg-black px-[22px] py-[5px] text-[20px]`}
          >
            <button
              onClick={handleAccountDeletion}
              className="cursor-pointer bg-gradient-to-b from-[#FFD12E] to-[#FF7C1D] bg-clip-text font-sans text-transparent"
            >
              confirm deletion
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountModal;
