import AddAdmin from "../components/Administration/AddAdmin";
import AdminCard from "../components/Administration/AdminCard";
import AdminList from "../components/Administration/AdminList";

function Administration() {
  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-row justify-between flex-none">
        <h1
          className="text-grad-stroke font-[700] text-[36px]"
          data-text="Administration"
        >
          Administration
        </h1>
      </div>
      <div className="flex-1 flex flex-col gap-3 overflow-y-auto">
        <div className="grid grid-cols-12 grid-rows-12 gap-3 p-4 h-full">
          <AdminList />
          
          <AddAdmin />
        </div>
      </div>
    </div>
  );
}

export default Administration;
