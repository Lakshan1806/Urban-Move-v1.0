import CustomerDetail from "../components/Customers/CustomerDetail";
import CustomerDetailList from "../components/Customers/CustomerDetailList";
import { useState } from "react";

function Customers() {
  const [customer, setCustomer] = useState(null);
  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-none flex-row justify-between">
        <h1
          className="text-grad-stroke text-[36px] font-[700]"
          data-text="Customers"
        >
          Customers
        </h1>
      </div>
      <div className="flex min-h-0 flex-1 snap-y snap-mandatory flex-col gap-3 overflow-y-auto scroll-smooth">
        <div className="grid h-full shrink-0 snap-start grid-cols-12 grid-rows-12 gap-3 p-4">
          <CustomerDetailList onSelect={setCustomer} />
          <CustomerDetail customer={customer} onUpdate={setCustomer} />
        </div>
      </div>
    </div>
  );
}

export default Customers;
