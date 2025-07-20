function DriverDetail({ customer, onUpdate }) {
    console.log(customer)
  if (!customer) {
    return (
      <div className="col-span-4 row-span-12 p-4 rounded-3xl shadow-[0px_10px_20px_0px_rgba(0,_0,_0,_0.15)] overflow-auto">
        <div className="flex justify-center items-center h-full text-xl font-bold">
          Select
        </div>
      </div>
    );
  }
  return (
    <div className="col-span-4 row-span-12 p-4 rounded-3xl shadow-[0px_10px_20px_0px_rgba(0,_0,_0,_0.15)] flex flex-col overflow-auto">
      CustomerDetail
      <p>{customer.username}</p>
    </div>
  );
}

export default DriverDetail;
