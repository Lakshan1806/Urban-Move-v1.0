import axios from "axios";
import { useEffect, useState } from "react";
import { FaArrowCircleRight } from "react-icons/fa";

function CustomerDetailList({ onSelect }) {
  const [user, setUser] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/admin/get_all_user");
        console.log(response);
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 10000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="col-span-8 row-span-12 flex flex-col overflow-auto rounded-3xl p-4 shadow-[0px_10px_20px_0px_rgba(0,_0,_0,_0.15)]">
      {user.map((user) => {
        console.log(user.photo);
        return (
          <div
            key={user._id}
            className="my-2 flex flex-row items-center justify-between gap-5 rounded-3xl p-4 shadow-[0px_10px_20px_0px_rgba(0,_0,_0,_0.15)]"
          >
            <div className="flex flex-row gap-5">
              <img
                src={user.authMethod === "google" ? user.avatar : user.photo}
                alt="profile image"
                className="h-16 w-16 rounded-full object-cover"
              />
              <div className="flex items-center gap-4">
                <p className="text-[20px] font-[750]">{user.username}</p>
                <p>Email: {user.email}</p>
                <p>Phone: {user.phone}</p>
              </div>
            </div>
            <div
              className="button-wrapper"
              onClick={() => {
                onSelect(user);
              }}
            >
              <button className="button-primary">
                <FaArrowCircleRight className="[&>path]:fill-[url(#icon-gradient)]" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default CustomerDetailList;
