"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

import { Car } from "@/types/types";
import UsersCarCard from "./_components/users-car-card";

const ProfilePage = () => {
  const { data: session } = useSession();
  const [cars, setCars] = useState<Car[]>([]); // Now cars is typed as an array of Car
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCars = async () => {
      if (session?.user?.email) {
        setLoading(true);
        setError(null);
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
          const response = await fetch(
            `${apiUrl}/users-cars?userID=${encodeURIComponent(
              session.user.email
            )}`
          );
          if (!response.ok) {
            throw new Error(`Failed to fetch cars: ${response.statusText}`);
          }
          const data = (await response.json()) as Car[]; // Assume that the JSON directly maps to Car[]
          setCars(data);
        } catch (err) {
          console.error("Error fetching cars:", err); // Log any errors that occur
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError("An unexpected error occurred");
          }
        } finally {
          setLoading(false);
        }
      }
    };

    fetchCars();
  }, [session]); // Re-run the effect if the session changes, particularly when a user logs in or out

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto mt-5">
      <h1 className="text-xl font-bold mb-4">Your Fleet Of Listed Cars</h1>
      {cars.length > 0 ? (
        cars.map((car) => (
          <UsersCarCard key={car.CarID} car={car} /> // Use CarCard component for each car
        ))
      ) : (
        <p>No cars listed yet.</p>
      )}
    </div>
  );
};

export default ProfilePage;
