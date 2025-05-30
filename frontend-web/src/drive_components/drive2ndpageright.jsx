import img2R from "../drive_photos/img2R.svg";

function Drive2ndpageright() {
  return (
    <div className="justify-center items-center col-span-6 row-span-12">
      <div className="flex flex-col items-center justify-center text-center h-full p-2 ">
        <h2 className="text-[28px] font-semibold mb-6">Get paid fast </h2>
        <p className="text-[20px]  leading-tight text-start px-48">
          With Urban Move, your earnings are automatically transferred to your
          bank account every week. Plus, with Instant Pay, you have the
          flexibility to cash out up to five times a day.
        </p>
        <div className="mt-4 h-full flex justify-center">
          <img src={img2R} alt="img2R" className="h-auto max-h-[325px] " />
        </div>
      </div>
    </div>
  );
}
export default Drive2ndpageright;
