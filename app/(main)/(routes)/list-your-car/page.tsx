"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid"; // You need to install uuid library
import { useSession } from "next-auth/react"; // Or your auth hook from Cognito

// Define the TypeScript interface for our form data
interface CarFormData {
  make: string;
  model: string;
  year: number;
  color: string;
  description: string;
  features: string[]; // Field for features
  images: string[]; // Field for storing image URLs
  location: string;
  price: number;
  type: string;
  userID: string; // Add userID to the form data
}

function generateCarID() {
  return uuidv4(); // Generates a unique UUID
}

const ListYourCar = () => {
  const { data: session } = useSession();

  const [formData, setFormData] = useState<CarFormData>({
    make: "",
    model: "",
    year: new Date().getFullYear(),
    color: "",
    description: "",
    features: [],
    images: [],
    location: "",
    price: 50,
    type: "",
    userID: " ", // Initialize with the user ID from session
  });

  useEffect(() => {
    // Ensure userID is always a string; set it to an empty string if session or session.user is not defined
    const userID = session?.user?.name ?? ""; // Use nullish coalescing to handle undefined or null
    setFormData((currentData) => ({
      ...currentData,
      userID: userID,
    }));
  }, [session]);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [fileInputState, setFileInputState] = useState<File[]>([]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === "features") {
      // Convert comma-separated string back to array when input changes
      const featuresArray = value.split(",").map((feature) => feature.trim());
      setFormData((prev) => ({
        ...prev,
        [name]: featuresArray,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setFileInputState(files);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.userID) {
      setError("User not authenticated.");
      return;
    }

    setLoading(true);
    const carID = generateCarID();
    const carDataWithID = { ...formData, CarID: carID };

    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    try {
      const res = await fetch(`${apiUrl}/cars`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(carDataWithID),
      });

      if (!res.ok) {
        throw new Error((await res.json()).error || "Failed to list car");
      }
      alert("Car listed successfully!");
      setFormData({
        ...formData,
        make: "",
        model: "",
        year: new Date().getFullYear(),
        color: "",
        description: "",
        features: [],
        images: [],
        location: "",
        price: 0,
        type: "",
        userID: "", // Reset userID to empty string or keep as is if you expect continuous use
      });
      setFileInputState([]);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!session || !session.user) {
    return <p>User not authenticated</p>;
  }
  return (
    <div className="container mx-auto mt-5">
      <Card className="p-20">
        <form
          onSubmit={handleSubmit}
          className="md:grid md:grid-cols-2 md:gap-10"
        >
          <div className="space-y-4 flex flex-col">
            <div className="flex flex-col gap-y-4">
              <h3 className="font-medium">1. Vehicle Make</h3>
              <input
                type="text"
                name="make"
                value={formData.make}
                onChange={handleChange}
                placeholder="Make"
                required
              />
            </div>

            <div className="flex flex-col gap-y-4">
              <h3 className="font-medium">2. Vehicle Model</h3>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleChange}
                placeholder="Model"
                required
              />
            </div>

            <div className="flex flex-col gap-y-4">
              <h3 className="font-medium">3. Vehicle Year</h3>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleChange}
                placeholder="Year"
                required
              />
            </div>

            <div className="flex flex-col gap-y-4">
              <h3 className="font-medium">5. Description of your vehicle</h3>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Description"
                required
              />
            </div>
          </div>
          <div className="space-y-4 flex flex-col">
            <div className="flex flex-col gap-y-4">
              <h3 className="font-medium">6. Vehicle Features</h3>
              <textarea
                name="features"
                value={formData.features.join(", ")}
                onChange={handleChange}
                placeholder="Features (comma-separated)"
                required
              />
            </div>
            <div className="flex flex-col gap-y-4">
              <h3 className="font-medium">7. Location</h3>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Location"
                required
              />
            </div>

            <div className="flex flex-col gap-y-4">
              <h3 className="font-medium">8. Price Per Day</h3>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Price per day"
                required
              />
            </div>

            <div className="flex flex-col gap-y-4">
              <h3 className="font-medium">9. Type of vehicle</h3>
              <input
                type="text"
                name="type"
                value={formData.type}
                onChange={handleChange}
                placeholder="Type (e.g., Sedan)"
                required
              />
            </div>

            {/* More existing fields */}
            <div className="flex flex-col gap-y-4">
              <h3 className="font-medium">10. Upload Images of Your Vehicle</h3>
              <input type="file" multiple onChange={handleFileChange} />
            </div>
          </div>
          <div className="md:col-span-2 flex justify-center">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <Button type="submit">List Your Car!</Button>
            )}
            {error && <p>Error: {error}</p>}
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ListYourCar;
