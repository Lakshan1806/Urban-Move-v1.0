import Logo from "../assets/Animated_Logo.gif";
import Loading from "../assets/Loading.gif";

function PrimaryLoadingScreen() {
  return (
    <div className="flex h-dvh w-dvw flex-col items-center justify-center">
      <img src={Logo} />
      <img className="h-10 w-10" src={Loading} />
    </div>
  );
}

export default PrimaryLoadingScreen;
