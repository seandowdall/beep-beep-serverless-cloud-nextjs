"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid"; // You need to install uuid library

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
}

function generateCarID() {
  return uuidv4(); // Generates a unique UUID
}

const ListYourCar = () => {
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
  });

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
    setLoading(true);
    setError(null);

    // Generate a unique CarID
    const carID = generateCarID();
    const carDataWithID = {
      ...formData,
      CarID: carID,
    };

    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    try {
      // Placeholder for your actual image upload logic
      // const imageUrls = fileInputState.map(
      //   (file) => `https://example.com/path/to/${file.name}`
      // );
      // carDataWithID.images = imageUrls;

      const res = await fetch(`${apiUrl}/cars`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(carDataWithID),
      });

      const data = await res.json(); // Parsing JSON response
      if (!res.ok) {
        throw new Error(data.error || "Failed to list car");
      }

      alert("Car listed successfully!");

      setFormData({
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
                name="Make"
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
                name="Model"
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
                name="Year"
                value={formData.year}
                onChange={handleChange}
                placeholder="Year"
                required
              />
            </div>

            <div className="flex flex-col gap-y-4">
              <h3 className="font-medium">5. Description of your vehicle</h3>
              <textarea
                name="Description"
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
                name="Features"
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
                name="Location"
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
                name="Price"
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
                name="Type"
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
