import YearlyIncomeChart from "./YearlyIncomeChart";

function YearlyIncome() { 
  return (
    <div className="col-span-4 row-span-6  rounded-xl shadow-[0px_10px_20px_0px_rgba(0,_0,_0,_0.15)]">
      <div className="sticky top-0 z-20 rounded-t-xl bg-white/30 backdrop-blur-md px-4 py-4 flex justify-center">
        <h3 className="text-sm font-bold uppercase">Yearly Income</h3>
      </div>
      <div>
        <YearlyIncomeChart />
      </div>
    </div>
  );
}

export default YearlyIncome;
