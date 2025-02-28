import CustomerDetails from "../components/Customers/CustomerDetails";

function Customers() {
  return (
    <div>
      <div>
        <h1 className="[-webkit-text-stroke:1px_rgb(255,124,29)] font-[700] text-[36px]">
          Customers
        </h1>
      </div>
      <div className="grid gap-3 grid-cols-12 grid-rows-12 h-svh">
        <CustomerDetails/>
      </div>
    </div>
  );
}

export default Customers;
