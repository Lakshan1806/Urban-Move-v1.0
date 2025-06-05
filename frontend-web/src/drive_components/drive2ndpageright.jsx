import img2R from "../drive_photos/img2R.svg";

function Drive2ndpageright() {
  return (
    <div className="justify-center items-center col-span-6 row-span-12">
      <div className="flex flex-col items-center justify-center text-center h-full p-2 ">
        <h3 className="text-[24px] font-semibold mb-4 text-center">
          Get paid fast
        </h3>

        <ul className="list-disc list-outside font-medium px-48  leading-tight text-start">
          <li>
            With Urban Move, your earnings are automatically transferred to your
            bank account every week. Plus, with Instant Pay, you have the
            flexibility to cash out up to five times a day.
          </li>
        </ul>

        <div className="mt-4 h-full flex justify-center">
          <img src={img2R} alt="img2R" className="h-auto max-h-[420px] " />
        </div>
      </div>
    </div>
  );
}
export default Drive2ndpageright;
