import img2L from "../drive_photos/img2L.svg";

function Drive2ndpageleft() {
  return (
    <div className="col-span-6 row-span-12 items-center justify-center">
      <div className="flex h-full flex-col items-center justify-center pb-0 lg:p-4">
        <h3 className="mb-4 text-center text-xl font-semibold sm:text-2xl md:text-3xl">
          Take control of your time
        </h3>

        <ul className="max-w-[600px] list-outside list-disc px-4 text-left leading-relaxed font-medium sm:px-8 md:px-12 lg:px-16">
          <li>
            Many driving jobs come with long hours and strict schedules. With
            Urban Move, you're in control.
          </li>
        </ul>

        <div className="mt-6 flex w-full justify-center lg:mt-4">
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
