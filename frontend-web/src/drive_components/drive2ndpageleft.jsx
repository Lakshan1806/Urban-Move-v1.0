import img2L from "../drive_photos/img2L.svg";

function Drive2ndpageleft() {
  return (
    <div className="justify-center items-center col-span-6 row-span-12">
      <div className="flex flex-col items-center justify-center text-center h-full p-2 ">
        <h3 className="text-[24px] font-semibold mb-4 ">
          Take control of your time
        </h3>

        <ul className="list-disc list-outside font-medium px-48  leading-tight text-start">
          <li>
            Many driving jobs come with long hours and strict schedules.With
            Urban Move, you're in control
          </li>
        </ul>

        <div className="mt-4 h-full flex justify-center">
          <img src={img2L} alt="img2L" className="h-auto max-h-[440px] " />
        </div>
      </div>
    </div>
  );
}

export default Drive2ndpageleft;
