"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Car } from "@/types/types"; // Assuming this is your type definition
import Link from "next/link"; // Import Link for navigation
import { ChevronLeftCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const CarIdPage = () => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const CarID = pathname.split("/").pop();
  const [car, setCar] = useState<Car | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [isDateValid, setIsDateValid] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    console.log("Pathname:", pathname);
    console.log("Car ID:", CarID);

    if (!CarID) {
      setError("Car ID not found.");
      return;
    }

    const fetchCarDetails = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const response = await fetch(`${apiUrl}/cars/${CarID}`);
        if (!response.ok) {
          throw new Error("Failed to fetch car details.");
        }
        const data: Car = await response.json();
        setCar(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : "An error occurred");
      }
    };

    fetchCarDetails();
  }, [CarID]);

  const handleDateChange = (start: string, end: string) => {
    setStartDate(start);
    setEndDate(end);
    // Simple validation: Ensure that the start date is before the end date
    const startD = new Date(start);
    const endD = new Date(end);
    setIsDateValid(startD <= endD && startD > new Date());
  };

  if (error)
    return <div className="text-red-500 text-lg font-bold">Error: {error}</div>;
  if (!car) return <div className="text-lg font-bold">Loading...</div>;

  //Add functionality to POST to your /api/booking endpoint when the user confirms their booking.
  const bookCar = async () => {
    if (!isDateValid) {
      alert("Invalid dates selected.");
      return;
    }

    const bookingDetails = {
      CarID,
      userID: session?.user?.email,
      startDate,
      endDate,
    };

    try {
      const response = await fetch("/api/sqs-booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingDetails),
      });

      const data = await response.json();
      if (response.ok) {
        alert(
          "Booking request submitted! Please await confirmation email before proceeding."
        );
        router.push("/profile");
      } else {
        alert(`Failed to book: ${data.message}`);
      }
    } catch (error) {
      // Check if 'error' is an instance of 'Error' to access 'message' safely
      if (error instanceof Error) {
        setError(error.message);
      } else {
        // Fallback error message if the caught error is not an instance of Error
        setError("An unexpected error occurred");
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-5">
      <Link
        href="/"
        className="absolute top-5 left-5 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors duration-200"
      >
        <div className="flex flex-row gap-2">
          <ChevronLeftCircle />
          Return to Home Page
        </div>
      </Link>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {car.images && car.images.length > 0 && (
          <img
            src={car.images[0]}
            alt={`${car.make} ${car.model}`}
            className="w-full h-64 object-cover"
          />
        )}
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-2">
            {car.make} {car.model} - {car.year}
          </h2>
          <p className="text-gray-700 mb-4">{car.description}</p>
          <ul className="list-disc list-inside mb-4">
            {car.features &&
              car.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
          </ul>
          <p className="text-lg font-semibold">Price: €{car.price} per day</p>
          {car.location && <p className="text-lg">Location: {car.location}</p>}
          {car.type && <p className="text-lg">Type: {car.type}</p>}
          {typeof car.availability !== "undefined" && (
            <p className="text-lg">
              Availability: {car.availability ? "Available" : "Not Available"}
            </p>
          )}
          {/* Date input for booking */}
          <div className="mt-4">
            <h3>From:</h3>
            <input
              type="date"
              value={startDate}
              onChange={(e) => handleDateChange(e.target.value, endDate)}
              className="mr-2 p-2 border rounded"
            />
            <h3 className="mt-4">To:</h3>
            <input
              type="date"
              value={endDate}
              onChange={(e) => handleDateChange(startDate, e.target.value)}
              className="p-2 border rounded"
            />
          </div>
          {/* Conditional rendering based on date validation */}
          {isDateValid ? (
            <div>
              <h3 className="mt-4">These dates may be available!</h3>
              <button
                onClick={bookCar}
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors duration-200 mt-4"
              >
                Book This Car
              </button>
            </div>
          ) : (
            <p className="text-red-500 mt-4">
              Please enter valid start and end dates (cars must be booked a day
              in advance).
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarIdPage;
