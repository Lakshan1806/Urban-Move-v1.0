function Drive3rdpage() {
  return (
    <div className="h-full w-full flex flex-col justify-center items-center p-4 md:p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-14 md:gap-6 xl:gap-8 w-full max-w-8xl">
        <div className="flex flex-col gap-3">
          <h3 className="text-lg md:text-xl xl:text-[24px] font-semibold mb-3 md:mb-4 text-center">
            Requirements
          </h3>
          <ul className="space-y-4 md:space-y-3 list-disc list-outside font-medium px-4 md:px-6 text-sm md:text-base">
            <li>Meet the minimum age to drive in your city</li>
            <li>Have at least one year of driving experience</li>
            <li>Clear a background check</li>
          </ul>
        </div>

        <div className="flex flex-col">
          <h3 className="text-lg md:text-xl xl:text-[24px] font-semibold mb-3 md:mb-4 text-center">
            Required documents
          </h3>
          <ul className="space-y-4 md:space-y-3 list-disc list-outside font-medium px-4 md:px-6 text-sm md:text-base">
            <li>Valid driver's license</li>
            <li>Proof of residency in your city, state, or province</li>
            <li>Insurance of the vehicle</li>
          </ul>
        </div>

        <div className="flex flex-col md:col-span-2 xl:col-span-1">
          <h3 className="text-lg md:text-xl xl:text-[24px] font-semibold mb-3 md:mb-4 text-center">
            Signup process
          </h3>
          <ul className="space-y-4 md:space-y-3 list-disc list-outside font-medium px-4 md:px-6 text-sm md:text-base">
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
