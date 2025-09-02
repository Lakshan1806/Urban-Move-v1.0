import { useState } from "react";
import axios from "axios";

function CustomerDetail({ customer, onUpdate }) {
  const [showConfirmTerminate, setShowConfirmTerminate] = useState(false);
  const [showConfirmRevoke, setShowConfirmRevoke] = useState(false);

  const handleTerminate = async () => {
    try {
      const response = await axios.patch("/admin/terminate_user", {
        _id: customer._id,
      });
      onUpdate(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRevoke = async () => {
    try {
      const response = await axios.patch("/admin/revoke_termination", {
        _id: customer._id,
      });
      onUpdate(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  console.log(customer);
  if (!customer) {
    return (
      <div className="col-span-4 row-span-12 overflow-auto rounded-3xl p-4 shadow-[0px_10px_20px_0px_rgba(0,_0,_0,_0.15)]">
        <div className="flex h-full items-center justify-center text-xl font-bold">
          Select
        </div>
      </div>
    );
  }
  return (
    <div className="col-span-4 row-span-12 flex flex-col gap-4 overflow-auto rounded-3xl p-4 shadow-[0px_10px_20px_0px_rgba(0,_0,_0,_0.15)]">
      <h3 className="flex justify-center text-sm font-bold uppercase">
        profile
      </h3>
      <div className="flex w-full justify-center">
        <img
          src={
            customer.authMethod === "google" ? customer.avatar : customer.photo
          }
          alt="profile image"
          className="h-48 w-48 rounded-full object-cover"
        />
      </div>

      <p>Name : {customer.username}</p>
      <p>Phone : {customer.phone}</p>
      <p>email : {customer.email}</p>
      <p>Authentication Method : {customer.authMethod}</p>
      <p>Account Status: {customer.isTerminated ? "Terminated" : "Active"}</p>
      <p>
        Verification :{customer.isAccountVerified ? "Verified" : "Not Verified"}
      </p>
      {customer.isTerminated ? (
        <div className="button-wrapper">
          <button
            type="button"
            onClick={() => setShowConfirmRevoke(true)}
            className="button-primary"
            title="Restore this user"
          >
            Revoke Termination
          </button>
        </div>
      ) : (
        <div className="button-wrapper">
          <button
            type="button"
            onClick={() => setShowConfirmTerminate(true)}
            className="button-primary"
            title="Terminate this user"
          >
            Terminate
          </button>
        </div>
      )}
      {showConfirmTerminate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="max-w-sm rounded-lg bg-white p-6 shadow-lg">
            <p className="mb-4">Really Terminate this Customer Profile ?</p>
            <div className="flex justify-end gap-2">
              <button
                className="rounded bg-gray-200 px-4 py-2"
                onClick={() => setShowConfirmTerminate(false)}
              >
                Cancel
              </button>
              <div className="button-wrapper">
                <button
                  className="button-primary"
                  onClick={() => {
                    handleTerminate();
                    setShowConfirmTerminate(false);
                  }}
                >
                  Yes, Terminate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showConfirmRevoke && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="max-w-sm rounded-lg bg-white p-6 shadow-lg">
            <p className="mb-4">
              {" "}
              Revoke Termination of this Customer Profile ?
            </p>
            <div className="flex justify-end gap-2">
              <button
                className="rounded bg-gray-200 px-4 py-2"
                onClick={() => setShowConfirmRevoke(false)}
              >
                Cancel
              </button>
              <div className="button-wrapper">
                <button
                  className="button-primary"
                  onClick={() => {
                    handleRevoke();
                    setShowConfirmRevoke(false);
                  }}
                >
                  Yes, Revoke
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomerDetail;
