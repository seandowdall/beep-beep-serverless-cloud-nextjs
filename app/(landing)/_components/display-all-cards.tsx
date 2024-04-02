"use client";

import React, { useEffect, useState } from "react";

import { Car } from "@/types/types";
import CarCard from "./car-card";

const DisplayAllCards = () => {
  const [data, setData] = useState<Car[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  async function getData() {
    setLoading(true);
    setError(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const res = await fetch(`${apiUrl}/cars`);
      if (!res.ok) throw new Error("Failed to fetch data");
      const jsonData = await res.json();
      if (jsonData && Array.isArray(jsonData)) {
        setData(jsonData);
      } else {
        throw new Error("Data is not in expected format");
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  }

  // Fetch data on component mount
  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="grid grid-cols-3 gap-4">
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {!loading &&
        !error &&
        data.map((car) => <CarCard key={car.CarID} car={car} />)}
    </div>
  );
};

export default DisplayAllCards;
