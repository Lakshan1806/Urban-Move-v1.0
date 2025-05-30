function Drive3rdpage() {
  const styles1 = "text-center text-[32px] font-[700]  ";
  const styles2 = " text-left text-[24px] font-[500] ";
  return (
    <div className="justify-center items-center col-span-12 row-span-6">
      <div className="col-span-12 row-start-5 row-span-7 grid grid-cols-3 gap-8 pt-6 ">
        <div className="flex flex-col">
          <h3 className="text-[24px] font-semibold mb-4 text-center">
            Requirements
          </h3>
          <ul className="space-y-3 text-[18px] px-6">
            <li>• Meet the minimum age to drive in your city</li>
            <li>• Have at least one year of driving experience</li>
            <li>• Clear a background check</li>
          </ul>
        </div>

        <div className="flex flex-col">
          <h3 className="text-[24px] font-semibold mb-4 text-center">
            Required documents
          </h3>
          <ul className="space-y-3 text-[18px] px-6 ">
            <li>• Valid driver's license</li>
            <li>• Proof of residency in your city, state, or province</li>
            <li>• Insurance of the vehicle</li>
          </ul>
        </div>

        <div className="flex flex-col">
          <h3 className="text-[24px] font-semibold mb-4 text-center ">
            Signup process
          </h3>
          <ul className="space-y-3 text-[18px] px-6">
            <li>• Submit documents and photo</li>
            <li>• Provide information for a background check</li>
            <li>• Find out if your car is eligible, or get a car</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
export default Drive3rdpage;
