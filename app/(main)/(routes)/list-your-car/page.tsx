"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useSession } from "next-auth/react";

interface CarFormData {
  make: string;
  model: string;
  year: number;
  color: string;
  description: string;
  features: string[];
  images: string[];
  location: string;
  price: number;
  type: string;
  userID: string;
}

interface UploadResponse {
  Key: string; // Assuming the response includes the object key
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
    userID: " ",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [fileInputState, setFileInputState] = useState<File[]>([]);

  useEffect(() => {
    if (session?.user) {
      setFormData((currentData) => ({
        ...currentData,
        userID: session?.user?.email ?? "",
      }));
    } else {
      setFormData((currentData) => ({ ...currentData, userID: "" }));
    }
  }, [session]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "features"
          ? value.split(",").map((feature) => feature.trim())
          : value,
    }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setFileInputState(files);

    const formData = new FormData();
    files.forEach((file) => formData.append("file", file));

    try {
      const response = await fetch("/api/s3-upload", {
        method: "POST",
        body: formData,
      });
      const keys = await response.json();

      const bucket = process.env.NEXT_PUBLIC_S3_BUCKET;
      const imageUrls = keys.map(
        (key: string) => `https://${bucket}.s3.amazonaws.com/${key}`
      );
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...imageUrls],
      }));
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error("An unexpected error occurred");
      console.error("Upload error:", error);
      setError("Failed to upload images: " + error.message);
    }
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
      const response = await fetch(`${apiUrl}/cars`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(carDataWithID),
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.error || "Failed to update DynamoDB");
      }

      alert("Car listed and database updated successfully!");
      // Reset form and state
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
        userID: "",
      });
      setFileInputState([]);
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error("An unexpected error occurred");
      setError(error.message);
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
