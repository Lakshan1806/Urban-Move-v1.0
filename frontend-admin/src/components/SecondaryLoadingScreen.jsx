import Loading from "../assets/Loading.gif";

function SecondaryLoadingScreen() {
  return (
    <div className="flex  items-center justify-center h-dvh w-dvw">
      <img className=" w-10 h-10" src={Loading} />
    </div>
  );
}

export default SecondaryLoadingScreen;
