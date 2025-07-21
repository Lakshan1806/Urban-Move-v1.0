import { useState } from "react";
import axios from "axios";

function DriverDetail({ driver, onUpdate }) {
  const [showConfirmTerminate, setShowConfirmTerminate] = useState(false);
  const [showConfirmRevoke, setShowConfirmRevoke] = useState(false);
  const [showConfirmApprove, setShowConfirmApprove] = useState(false);

  const handleTerminate = async () => {
    try {
      const response = await axios.patch("/admin/terminate_driver", {
        _id: driver._id,
      });
      onUpdate(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleApprove = async () => {
    try {
      const response = await axios.patch("/admin/approve_driver", {
        _id: driver._id,
      });
      onUpdate(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRevoke = async () => {
    try {
      const response = await axios.patch("/admin/revoke_driver_termination", {
        _id: driver._id,
      });
      onUpdate(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  console.log(driver);
  if (!driver) {
    return (
      <div className="col-span-4 row-span-12 p-4 rounded-3xl shadow-[0px_10px_20px_0px_rgba(0,_0,_0,_0.15)] overflow-auto">
        <div className="flex justify-center items-center h-full text-xl font-bold">
          Select
        </div>
      </div>
    );
  }
  return (
    <div className="col-span-4 row-span-12 p-4 rounded-3xl shadow-[0px_10px_20px_0px_rgba(0,_0,_0,_0.15)] flex flex-col overflow-auto gap-4">
      <h3 className="flex justify-center text-sm font-bold uppercase">
        profile
      </h3>
      <div className="flex w-full justify-center">
        <img
          src={driver.authMethod === "google" ? driver.avatar : driver.photo}
          alt="profile image"
          className="w-48 h-48 rounded-full object-cover"
        />
      </div>

      <p>Name : {driver.username}</p>
      <p>Phone : {driver.phone}</p>
      <p>email : {driver.email}</p>
      <p>Authentication Method : {driver.authMethod}</p>
      <p>Account Status: {driver.isTerminated ? "Terminated" : "Active"}</p>
      <p>Account Approval: {driver.driverVerified}</p>
      <p>
        Verification :{driver.isAccountVerified ? "Verified" : "Not Verified"}
      </p>

      <p>Vehicle Details</p>
      <p>Colour : {driver.carColor}</p>
      <p>Number Plate : {driver.carNumber}</p>
      {driver.isTerminated ? (
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
      {driver.driverVerified === "pending" && (
        <div className="button-wrapper">
          <button
            type="button"
            onClick={() => setShowConfirmApprove(true)}
            className="button-primary"
            title="Approve this driver"
          >
            Approve
          </button>
        </div>
      )}
      {showConfirmTerminate && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm">
            <p className="mb-4">Really Terminate this driver Profile ?</p>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-200 rounded"
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
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm">
            <p className="mb-4"> Revoke Termination of this driver Profile ?</p>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-200 rounded"
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
      {showConfirmApprove && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm">
            <p className="mb-4">Approve this driver Profile ?</p>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-200 rounded"
                onClick={() => setShowConfirmApprove(false)}
              >
                Cancel
              </button>
              <div className="button-wrapper">
                <button
                  className="button-primary"
                  onClick={() => {
                    handleApprove();
                    setShowConfirmTerminate(false);
                  }}
                >
                  Yes, Approve
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DriverDetail;
