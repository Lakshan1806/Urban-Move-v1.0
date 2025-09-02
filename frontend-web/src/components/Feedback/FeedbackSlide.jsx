const FeedbackSlide = ({ feedback }) => {
  const userPhoto = feedback?.userId?.photo;
  const username = feedback?.userId?.username || "Anonymous";
  const userInitial = username.charAt(0).toUpperCase();

  return (
    <div className="mx-auto max-w-md rounded-lg border border-gray-300 bg-white p-6 shadow-xl">
      <div className="mb-4 flex items-center">
        {userPhoto ? (
          <img
            src={userPhoto}
            alt={username}
            className="mr-4 h-12 w-12 rounded-full object-cover"
          />
        ) : (
          <div className="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-300">
            <span className="text-lg text-gray-600">{userInitial}</span>
          </div>
        )}
        <h3 className="text-lg font-semibold">{username}</h3>
      </div>

      <div className="mb-4 flex">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`h-6 w-6 ${i < feedback.rating ? "text-yellow-400" : "text-gray-300"}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>

      <p className="text-gray-700 italic">"{feedback.note}"</p>
      <p className="mt-2 text-sm text-gray-500">
        {new Date(feedback.createdAt).toLocaleDateString()}
      </p>
    </div>
  );
};

export default FeedbackSlide;
