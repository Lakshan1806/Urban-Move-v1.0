function Drive3rdpage() {
  const styles1 = "text-center text-[32px] font-[700]  ";
  const styles2 = " text-left text-[24px] font-[500] ";
  return (
    <div className="justify-center items-center col-span-12 row-span-6">
      <div className="flex flex-row">
        <div>
          <p className={styles1}>Requirements</p>
          <div className={styles2}>
            <ul className="list-disc list-outside ">
              <li>Meet the minimum age to drive in your city. </li>
              <li>Have at least one year of driving experience. </li>
              <li>Clear a background check.</li>
            </ul>
          </div>
        </div>
        <div>
          <p className={styles1}>Required documents</p>
          <div className={styles2}>
            <ul className="list-disc list-outside">
              <li>Valid driver's license</li>
              <li>Proof of residency in your city, state, or province</li>
              <li>Insurance of the vehicle</li>
            </ul>
          </div>
        </div>
        <div>
          <p className={styles1}> Signup process</p>
          <div className={styles2}>
            <ul className="list-disc list-outside">
              <li>Submit documents and photo</li>
              <li>Provide information for a background check</li>
              <li>Find out if your car is eligible, or get a car</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Drive3rdpage;
