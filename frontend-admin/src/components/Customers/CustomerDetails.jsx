import axios from "axios";
import { useEffect, useState } from "react";

function CustomerDetails() {
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
    <div className="col-span-12 row-span-12 p-4 rounded shadow-[0px_10px_20px_0px_rgba(0,_0,_0,_0.15)] flex flex-col overflow-auto">
      {user.map((user) => {
        console.log(user.photo);
        return (
          <div
            key={user._id}
            className="p-4 my-2 rounded shadow-[0px_10px_20px_0px_rgba(0,_0,_0,_0.15)] flex flex-row gap-5 items-center justify-between"
          >
            <div className="flex flex-row gap-5">
              <img
                src={user.authMethod === "google" ? user.avatar : user.photo}
                alt="profile image"
                className="w-24 h-24 rounded-full object-cover"
              />
              <div>
                <h3 className="text-lg font-bold">{user.name}</h3>
                <p>Username: {user.username}</p>
                <p>Email: {user.email}</p>
                <p>Phone: {user.phone}</p>
              </div>
            </div>
            <div className="button-wrapper">
              <button className="button-primary">Terminate</button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default CustomerDetails;
