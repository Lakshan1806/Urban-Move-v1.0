import AccountInfo from "../components/Account/AccountInfo";

function Account() {
  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-none flex-row justify-between">
        <h1
          className="text-grad-stroke text-[36px] font-[700]"
          data-text="Account"
        >
          Account
        </h1>
      </div>
      <div className="flex flex-1 flex-col gap-3 overflow-y-auto">
        <div className="grid h-full shrink-0 grid-cols-12 grid-rows-12 gap-3 p-4">
          <AccountInfo />
        </div>
      </div>
    </div>
  );
}

export default Account;
