import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Taxi from "../assets/help_logo.svg";
import Ride from "../assets/help_ride.svg";
import Rent from "../assets/help_rent.svg";
import Drive from "../assets/help_drive.svg";

const Help = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const faqData = [
    {
      ride: {
        q: "How to book a ride?",
        a: "Use the web to select your pickup and drop-off location, then confirm your ride.",
      },
      rent: {
        q: "How to rent a car?",
        a: "Choose a vehicle from our rental fleet and complete the booking with your documents.",
      },
      drive: {
        q: "How to become a driver?",
        a: "Register via the driver signup form and submit your documents for approval.",
      },
    },
    {
      ride: {
        q: "Can I schedule a ride in advance?",
        a: "Yes, you can schedule rides up to 7 days ahead.",
      },
      rent: {
        q: "What documents are required for rent?",
        a: "You need a valid driver’s license and a government-issued ID.",
      },
      drive: {
        q: "How to check ride history as driver?",
        a: "Go to the 'My Rides' section in your driver dashboard.",
      },
    },
    {
      ride: {
        q: "How do I cancel a ride?",
        a: "You can cancel a ride within 5 minutes of booking without charges.",
      },
      rent: {
        q: "Is fuel included in the rent?",
        a: "No, fuel costs are your responsibility during the rental period.",
      },
      drive: {
        q: "How are drivers paid?",
        a: "Payments are processed weekly via bank transfer.",
      },
    },
    {
      ride: {
        q: "Is ride booking available 24/7?",
        a: "Yes, our ride services operate around the clock.",
      },
      rent: {
        q: "Can I extend my rental duration?",
        a: "Yes, extensions can be made via the app before your rental ends.",
      },
      drive: {
        q: "What are driver eligibility criteria?",
        a: "Drivers must be 21+, have a valid license, and pass a background check.",
      },
    },
    {
      ride: {
        q: "Are shared rides available?",
        a: "Yes, you can select the 'Shared Ride' option when booking.",
      },
      rent: {
        q: "Are there any late return charges?",
        a: "Yes, late returns incur additional hourly fees as per the rental policy.",
      },
      drive: {
        q: "How to update driver profile?",
        a: "Update your info in the driver app under 'Profile Settings'.",
      },
    },
    {
      ride: {
        q: "How can I rate a driver?",
        a: "After your trip, you'll be prompted to give a rating and feedback.",
      },
      rent: {
        q: "Is insurance included?",
        a: "Basic insurance is included with all rentals. Additional coverage is optional.",
      },
      drive: {
        q: "How to get more ride requests?",
        a: "Maintain high ratings and stay active during peak hours to get more requests.",
      },
    },
    {
      ride: {
        q: "How to apply promo code?",
        a: "Enter your promo code in the payment page before confirming the ride.",
      },
      rent: {
        q: "Can I cancel my rent booking?",
        a: "Yes, cancel at least 24 hours before to avoid cancellation fees.",
      },
      drive: {
        q: "Where to view earnings summary?",
        a: "Earnings can be viewed on the driver dashboard under 'Earnings'.",
      },
    },
  ];

  const filteredFaq = faqData.filter(({ ride, rent, drive }) =>
    [ride.q, ride.a, rent.q, rent.a, drive.q, drive.a]
      .some(text => text.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="flex flex-col items-center text-center px-4 pb-10">
      <img src={Taxi} alt="Taxi Logo" className="w-[197px] h-[197px] mb-5" />
      <h2 className="text-4xl font-light bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
        Welcome to Urban Drive Support
      </h2>

      <div className="flex flex-wrap justify-center gap-75 mt-8">
        <div className="w-[220px] p-4 border-4 border-yellow-400 rounded-lg flex flex-col items-center">
          <img src={Ride} alt="Ride" className="w-[180px] h-[180px]" />
          <div className="text-4xl font-light bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">RIDE</div>
        </div>

        <div className="w-[220px] p-4 border-4 border-yellow-400 rounded-lg flex flex-col items-center">
          <img src={Rent} alt="Rent" className="w-[180px] h-[180px]" />
          <div className="text-4xl font-light bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">RENT</div>
        </div>

        <div className="w-[220px] p-4 border-4 border-yellow-400 rounded-lg flex flex-col items-center">
          <img src={Drive} alt="Drive" className="w-[180px] h-[180px]" />
          <div className="text-4xl font-light bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">DRIVE</div>
        </div>
      </div>

      <input
        type="text"
        placeholder="Search Help..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mt-8 mb-6 px-4 py-2 border-2 border-yellow-400 rounded-lg w-full max-w-[600px] text-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
      />

      <div className="w-full max-w-[960px]">
        <div className="grid grid-cols-3 text-lg font-medium text-yellow-700 border-y-2 border-yellow-400 py-2">
          <div>RIDE</div>
          <div className="border-l-2 border-r-2 border-yellow-400">RENT</div>
          <div>DRIVE</div>
        </div>

        {filteredFaq.length > 0 ? (
          filteredFaq.map((row, idx) => (
            <div
              key={idx}
              className="grid grid-cols-3 text-left text-gray-800 border-b border-gray-200 py-4"
            >
              <div className="pr-4">
                <p className="font-semibold">{row.ride.q}</p>
                <p className="mt-1 text-sm">{row.ride.a}</p>
              </div>

              <div className="border-l-2 border-r-2 border-yellow-200 px-4">
                <p className="font-semibold">{row.rent.q}</p>
                <p className="mt-1 text-sm">{row.rent.a}</p>
              </div>

              <div className="pl-4">
                <p className="font-semibold">{row.drive.q}</p>
                <p className="mt-1 text-sm">{row.drive.a}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-6 text-gray-500">
            No matching help topics found.
          </div>
        )}
      </div>

      <button
        onClick={() => navigate("/chat")}
        className="mt-8 px-6 py-3 bg-yellow-500 text-white text-xl rounded-lg hover:bg-orange-500"
      >
        Go to Payment
      </button>
    </div>
  );
};

export default Help;
