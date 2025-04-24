import imgg from "../signup_photos/googlelogo.svg"; 

export default function GoogleLoginButton() {
  const handleClick = () => {
    window.location.href = "http://localhost:5000/api/auth/google";
  };

  return (
    <button
      onClick={handleClick}
      className="bg-white w-full p-2 border rounded border-[#FFD12E] text-center mt-3 cursor-pointer" >
      <img src={imgg} alt="Google" className="inline-block mr-2" />
      Sign in with Google
    </button>
  );
}
