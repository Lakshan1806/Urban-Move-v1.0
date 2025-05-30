import AddAdmin from "../components/Administration/AddAdmin";
import AdminCard from "../components/Administration/AdminCard";
import AdminList from "../components/Administration/AdminList";

function Administration() {
  return (
    <div className="h-full flex flex-col">
      <h1 className="[-webkit-text-stroke:1px_rgb(255,124,29)] font-[700] text-[36px] flex-none">
        Administration
      </h1>
      <div className="flex-1 flex flex-col gap-3 overflow-y-auto">
        <div className="grid grid-cols-12 grid-rows-12 gap-3 p-4 h-full">
          <AdminList />
          <AdminCard />
          <AddAdmin />
        </div>
      </div>
    </div>
  );
}

export default Administration;
