import img2R from "../drive_photos/img2R.svg";

function Drive2ndpageright() {
  return (
    <div className="justify-center items-center col-span-6 row-span-12">
      <div className="flex flex-col items-center justify-center h-full lg:p-4 pb-0">
        <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-4 text-center">
          Get paid fast
        </h3>

        <ul className="list-disc list-outside font-medium text-left px-4 sm:px-8 md:px-12 lg:px-16 leading-relaxed max-w-[600px]">
          <li>
            With Urban Move, your earnings are automatically transferred to your
            bank account every week. Plus, with Instant Pay, you have the
            flexibility to cash out up to five times a day.
          </li>
        </ul>

        <div className="mt-8 lg:mt-4 w-full flex justify-center">
          <img
            src={img2R}
            alt="Drive Right"
            className="w-full max-w-[460px] object-contain"
          />
        </div>
      </div>
    </div>
  );
}
export default Drive2ndpageright;
