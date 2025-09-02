import AddAdmin from "../components/Administration/AddAdmin";
import AdminCard from "../components/Administration/AdminCard";
import AdminList from "../components/Administration/AdminList";

function Administration() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-none flex-row justify-between">
        <h1
          className="text-grad-stroke text-[36px] font-[700]"
          data-text="Administration"
        >
          Administration
        </h1>
      </div>
      <div className="flex flex-1 flex-col gap-3 overflow-y-auto">
        <div className="grid h-full grid-cols-12 grid-rows-12 gap-3 p-4">
          <AdminList />

          <AddAdmin />
        </div>
      </div>
    </div>
  );
}

export default Administration;
