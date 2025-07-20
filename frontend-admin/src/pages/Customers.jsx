import CustomerDetail from "../components/Customers/CustomerDetail";
import CustomerDetailList from "../components/Customers/CustomerDetailList";
import { useState } from "react";

function Customers() {
  const [customer, setCustomer] = useState(null);
  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-row justify-between flex-none">
        <h1
          className="text-grad-stroke font-[700] text-[36px]"
          data-text="Customers"
        >
          Customers
        </h1>
      </div>
      <div className="flex-1 flex flex-col gap-3 overflow-y-auto min-h-0 snap-y snap-mandatory scroll-smooth">
        <div className="grid grid-cols-12 grid-rows-12 gap-3 p-4 h-full shrink-0 snap-start">
          <CustomerDetailList onSelect={setCustomer} />
          <CustomerDetail customer={customer} onUpdate={setCustomer} />
        </div>
      </div>
    </div>
  );
}

export default Customers;
