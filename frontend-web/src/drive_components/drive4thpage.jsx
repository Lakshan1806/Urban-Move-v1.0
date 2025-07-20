function Drive4thpage() {
  return (
    <div className="h-full w-full flex flex-col justify-center items-center p-4 md:p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-14 md:gap-6 xl:gap-8 w-full max-w-8xl">
        <div className="flex flex-col gap-3">
          <h3 className="text-lg md:text-xl xl:text-[24px] font-semibold mb-3 md:mb-4 text-center">
            Protection on every trip
          </h3>
          <ul className="space-y-6 md:space-y-3 list-disc list-outside font-medium px-4 md:px-6 text-sm md:text-base">
            <li>
              For every trip you complete using the Driver app, we provide auto
              insurance coverage to ensure the safety and protection of both you
              and your rider.
            </li>
          </ul>
        </div>
        <div className="flex flex-col">
          <h3 className="text-lg md:text-xl xl:text-[24px] font-semibold mb-3 md:mb-4 text-center">
            Help if you need it
          </h3>
          <ul className="space-y-6 md:space-y-3 list-disc list-outside font-medium px-4 md:px-6 text-sm md:text-base">
            <li>
              The Emergency Button connects you directly to 119, allowing you to
              get help quickly.
            </li>
            <li>
              The app also displays your trip details, making it easy to share
              crucial information with authorities when needed.
            </li>
          </ul>
        </div>
        <div className="flex flex-col md:col-span-2 xl:col-span-1">
          <h3 className="text-lg md:text-xl xl:text-[24px] font-semibold mb-3 md:mb-4 text-center">
            Community Guidelines
          </h3>
          <ul className="space-y-6 md:space-y-3 list-disc list-outside font-medium px-4 md:px-6 text-sm md:text-base">
            <li>
              Our standards are designed to ensure safe connections and foster
              positive interactions for everyone.
            </li>
            <li>
              Discover how these guidelines apply to you and enhance your
              experience.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
export default Drive4thpage;
