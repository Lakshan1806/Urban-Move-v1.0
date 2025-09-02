import Loading from "../assets/Loading.gif";

function SecondaryLoadingScreen() {
  return (
    <div className="flex h-dvh w-dvw items-center justify-center">
      <img className="h-10 w-10" src={Loading} />
    </div>
  );
}

export default SecondaryLoadingScreen;
