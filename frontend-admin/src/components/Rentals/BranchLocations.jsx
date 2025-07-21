import { useState, useEffect } from "react";
import axios from "axios";

function BranchLocations() {
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [branch, setBranch] = useState("");
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/admin/get_branch_locations");
        console.log(response.data);
        setLocations(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 10000);
    return () => clearInterval(intervalId);
  }, []);

  const handleSubmit = async () => {
    /* if (!branch || latitude === "" || longitude === "") {
      return setStatus("Please fill in all fields.");
    } */

    /* const latNum = Number(latitude);
    const lngNum = Number(longitude);
    if (Number.isNaN(latNum) || Number.isNaN(lngNum)) {
      return setStatus("Latitude and longitude must be numbers.");
    }
    if (Math.abs(latNum) > 90 || Math.abs(lngNum) > 180) {
      return setStatus("Coordinates out of range.");
    } */

    try {
      await axios.post("/admin/add_branch_location", {
        location: branch,
        lat: latitude,
        lng: longitude,
        zoom: 15,
      });
      setBranch(null);
      setLatitude(null);
      setLongitude(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="col-span-6 row-span-6 pb-0 rounded-3xl shadow-[0px_10px_20px_0px_rgba(0,_0,_0,_0.15)] flex gap-4 overflow-hidden">
      <div className="p-5">
        <div className="sticky top-0 z-20 bg-white/30 rounded-t-xl backdrop-blur-md px-4 py-4 flex justify-center">
          <h3 className="text-sm font-bold uppercase">Branch Locations</h3>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="branch" className="font-medium">
            Branch name
          </label>
          <input
            id="branch"
            name="branch"
            type="text"
            value={branch}
            onChange={(e) => {
              setBranch(e.target.value);
            }}
            placeholder="e.g. Colombo"
            className="rounded border px-3 py-2"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="lat" className="font-medium">
              Latitude
            </label>
            <input
              id="lat"
              name="lat"
              type="number"
              step="any"
              value={latitude}
              onChange={(e) => {
                setLatitude(e.target.value);
              }}
              placeholder="6.7974546"
              className="rounded border px-3 py-2"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="lng" className="font-medium">
              Longitude
            </label>
            <input
              id="lng"
              name="lng"
              type="number"
              step="any"
              value={longitude}
              onChange={(e) => {
                setLongitude(e.target.value);
              }}
              placeholder="79.9031792"
              className="rounded border px-3 py-2"
              required
            />
          </div>
        </div>

        <button onClick={handleSubmit} className="button-wrapper m-4">
          <div className="button-primary">Save location</div>
        </button>
      </div>
      <div className="overflow-auto h-full">
        {locations.map((location) => {
          const [lng, lat] = location.position.coordinates;
          const src = `https://maps.google.com/maps?q=${lat},${lng}&z=${
            location.zoom ?? 15
          }&output=embed`;
          return (
            <div
              key={location._id}
              className="p-4 mx-4 rounded-xl shadow-[0px_10px_20px_0px_rgba(0,_0,_0,_0.15)] flex flex-row gap-4 "
            >
              <div className="flex flex-col w-1/2">
                <h3 className="text-sm font-bold">{location.location}</h3>
                <iframe
                  title={`Map of ${location.location}`}
                  src={src}
                  width="100%"
                  height="450"
                  loading="lazy"
                  style={{ border: 0 }}
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default BranchLocations;
