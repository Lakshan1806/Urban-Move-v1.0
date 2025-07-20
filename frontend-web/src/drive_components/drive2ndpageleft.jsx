import img2L from "../drive_photos/img2L.svg";

function Drive2ndpageleft() {
  return (
    <div className="justify-center items-center col-span-6 row-span-12">
      <div className="flex flex-col items-center justify-center h-full pb-0 lg:p-4">
        <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-4 text-center">
          Take control of your time
        </h3>

        <ul className="list-disc list-outside font-medium text-left px-4 sm:px-8 md:px-12 lg:px-16 leading-relaxed max-w-[600px]">
          <li>
            Many driving jobs come with long hours and strict schedules. With
            Urban Move, you're in control.
          </li>
        </ul>

        <div className="mt-6 lg:mt-4 w-full flex justify-center">
          <img
            src={img2L}
            alt="Drive Left"
            className="w-full max-w-[450px] object-contain"
          />
        </div>
      </div>
    </div>
  );
}

export default Drive2ndpageleft;
