import img2L from "../drive_photos/img2L.svg";

function Drive2ndpageleft() {
  return (
    <div className="justify-center items-center col-span-6 row-span-12">
      <div className="flex flex-col items-center justify-center text-center h-full p-2 ">
        <h2 className="text-[28px] font-semibold mb-6">
          Take control of your time
        </h2>

        <p className="text-[20px]  leading-tight text-start">
          Many driving jobs come with long
          <br />
          hours and strict schedules.With
          <br />
          Urban Move, you're in control
        </p>

        <div className="mt-4 h-full flex justify-center">
          <img
            src={img2L}
            alt="Time control illustration"
            className="h-auto max-h-[375px] "
          />
        </div>
      </div>
    </div>
  );
}

export default Drive2ndpageleft;
