function Drive3rdpage() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-4 md:p-4">
      <div className="max-w-8xl grid w-full grid-cols-1 gap-14 md:grid-cols-2 md:gap-6 xl:grid-cols-3 xl:gap-8">
        <div className="flex flex-col gap-3">
          <h3 className="mb-3 text-center text-lg font-semibold md:mb-4 md:text-xl xl:text-[24px]">
            Requirements
          </h3>
          <ul className="list-outside list-disc space-y-4 px-4 text-sm font-medium md:space-y-3 md:px-6 md:text-base">
            <li>Meet the minimum age to drive in your city</li>
            <li>Have at least one year of driving experience</li>
            <li>Clear a background check</li>
          </ul>
        </div>

        <div className="flex flex-col">
          <h3 className="mb-3 text-center text-lg font-semibold md:mb-4 md:text-xl xl:text-[24px]">
            Required documents
          </h3>
          <ul className="list-outside list-disc space-y-4 px-4 text-sm font-medium md:space-y-3 md:px-6 md:text-base">
            <li>Valid driver's license</li>
            <li>Proof of residency in your city, state, or province</li>
            <li>Insurance of the vehicle</li>
          </ul>
        </div>

        <div className="flex flex-col md:col-span-2 xl:col-span-1">
          <h3 className="mb-3 text-center text-lg font-semibold md:mb-4 md:text-xl xl:text-[24px]">
            Signup process
          </h3>
          <ul className="list-outside list-disc space-y-4 px-4 text-sm font-medium md:space-y-3 md:px-6 md:text-base">
            <li>Submit documents and photo</li>
            <li>Provide information for a background check</li>
            <li>Find out if your car is eligible, or get a car</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
export default Drive3rdpage;
