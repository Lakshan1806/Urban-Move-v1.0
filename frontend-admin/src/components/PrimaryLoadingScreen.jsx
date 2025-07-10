import Logo from "../assets/Animated_Logo.gif";
import Loading from "../assets/Loading.gif";

function PrimaryLoadingScreen() {
  return (
    <div className="flex flex-col items-center justify-center h-dvh w-dvw">
      <img src={Logo} />
      <img className=" w-10 h-10" src={Loading} />
    </div>
  );
}

export default PrimaryLoadingScreen;
