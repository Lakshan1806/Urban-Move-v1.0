import img2R from "../drive_photos/img2R.svg";

function Drive2ndpageright() {
  return (
    <div className="col-span-6 row-span-12 items-center justify-center">
      <div className="flex h-full flex-col items-center justify-center pb-0 lg:p-4">
        <h3 className="mb-4 text-center text-xl font-semibold sm:text-2xl md:text-3xl">
          Get paid fast
        </h3>

        <ul className="max-w-[600px] list-outside list-disc px-4 text-left leading-relaxed font-medium sm:px-8 md:px-12 lg:px-16">
          <li>
            With Urban Move, your earnings are automatically transferred to your
            bank account every week. Plus, with Instant Pay, you have the
            flexibility to cash out up to five times a day.
          </li>
        </ul>

        <div className="mt-8 flex w-full justify-center lg:mt-4">
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
