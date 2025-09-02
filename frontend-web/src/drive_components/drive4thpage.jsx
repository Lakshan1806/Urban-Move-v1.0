function Drive4thpage() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-4 md:p-4">
      <div className="max-w-8xl grid w-full grid-cols-1 gap-14 md:grid-cols-2 md:gap-6 xl:grid-cols-3 xl:gap-8">
        <div className="flex flex-col gap-3">
          <h3 className="mb-3 text-center text-lg font-semibold md:mb-4 md:text-xl xl:text-[24px]">
            Protection on every trip
          </h3>
          <ul className="list-outside list-disc space-y-6 px-4 text-sm font-medium md:space-y-3 md:px-6 md:text-base">
            <li>
              For every trip you complete using the Driver app, we provide auto
              insurance coverage to ensure the safety and protection of both you
              and your rider.
            </li>
          </ul>
        </div>
        <div className="flex flex-col">
          <h3 className="mb-3 text-center text-lg font-semibold md:mb-4 md:text-xl xl:text-[24px]">
            Help if you need it
          </h3>
          <ul className="list-outside list-disc space-y-6 px-4 text-sm font-medium md:space-y-3 md:px-6 md:text-base">
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
          <h3 className="mb-3 text-center text-lg font-semibold md:mb-4 md:text-xl xl:text-[24px]">
            Community Guidelines
          </h3>
          <ul className="list-outside list-disc space-y-6 px-4 text-sm font-medium md:space-y-3 md:px-6 md:text-base">
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
