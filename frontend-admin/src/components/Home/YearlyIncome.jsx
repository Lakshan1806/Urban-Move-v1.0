import YearlyIncomeChart from "./YearlyIncomeChart";

function YearlyIncome() {
  return (
    <div className="col-span-3 row-span-6 flex flex-col rounded-3xl shadow-[0px_10px_20px_0px_rgba(0,_0,_0,_0.15)]">
      <div className="sticky top-0 z-20 flex justify-center rounded-t-3xl bg-white/30 px-4 py-4 backdrop-blur-md">
        <h3 className="text-sm font-bold uppercase">Yearly Income</h3>
      </div>

      <div className="min-h-0 flex-1 p-4">
        <YearlyIncomeChart />
      </div>
    </div>
  );
}

export default YearlyIncome;
