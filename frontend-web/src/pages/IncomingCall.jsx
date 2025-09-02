const IncomingCall = ({ answerCall, rejectCall, caller }) => {
  return (
    <div className="bg-opacity-70 fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="w-full max-w-sm rounded-lg bg-white p-8 shadow-xl">
        <h3 className="mb-2 text-xl font-bold">Incoming Call</h3>
        <p className="mb-6">From: User {caller}</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={answerCall}
            className="flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-white hover:bg-green-600"
          >
            Answer
          </button>
          <button
            onClick={rejectCall}
            className="flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
};

export default IncomingCall;
