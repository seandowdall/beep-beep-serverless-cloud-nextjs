"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Car } from "@/types/types"; // Assuming this is your type definition
import Link from "next/link"; // Import Link for navigation
import { ChevronLeftCircle } from "lucide-react";

const CarIdPage = () => {
  const pathname = usePathname();
  const carId = pathname.split("/").pop();

  const [car, setCar] = useState<Car | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!carId) {
      setError("Car ID not found.");
      return;
    }

    const fetchCarDetails = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const response = await fetch(`${apiUrl}/cars/${carId}`);
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
  }, [carId]);

  if (error)
    return <div className="text-red-500 text-lg font-bold">Error: {error}</div>;
  if (!car) return <div className="text-lg font-bold">Loading...</div>;

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
        {car.Images && car.Images.length > 0 && (
          <img
            src={car.Images[0]}
            alt={`${car.Make} ${car.Model}`}
            className="w-full h-64 object-cover"
          />
        )}
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-2">
            {car.Make} {car.Model} - {car.Year}
          </h2>
          <p className="text-gray-700 mb-4">{car.Description}</p>
          <ul className="list-disc list-inside mb-4">
            {car.Features &&
              car.Features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
          </ul>
          <p className="text-lg font-semibold">Price: ${car.Price} per day</p>
          {car.Location && <p className="text-lg">Location: {car.Location}</p>}
          {car.Type && <p className="text-lg">Type: {car.Type}</p>}
          {typeof car.Availability !== "undefined" && (
            <p className="text-lg">
              Availability: {car.Availability ? "Available" : "Not Available"}
            </p>
          )}
          <div className="mt-4">
            <Link
              href={`/booking/${carId}`}
              className="inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors duration-200"
            >
              Proceed to Payment
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarIdPage;
