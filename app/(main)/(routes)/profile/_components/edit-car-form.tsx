import React, { useState } from "react";
import { Button } from "@/components/ui/button"; // Adjust the import path as needed
import { Car } from "@/types/types"; // Adjust the import path and ensure it includes all needed fields

interface EditCarFormProps {
  car: Car;
  onClose: () => void;
}

const EditCarForm: React.FC<EditCarFormProps> = ({ car, onClose }) => {
  // State to track form input values
  const [formValues, setFormValues] = useState({
    make: car.make,
    model: car.model,
    year: car.year,
    location: car.location,
    price: car.price,
    type: car.type,
    description: car.description,
  });

  // Added state for tracking submission status
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await fetch(`${apiUrl}/cars/${car.CarID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formValues),
      });

      if (!response.ok) {
        throw new Error("Failed to update car information");
      }

      alert("Car information updated successfully");
      onClose(); // Close the form and potentially refresh the page or data
    } catch (error) {
      alert((error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="make"
          className="block text-sm font-medium text-gray-700"
        >
          Make
        </label>
        <input
          type="text"
          id="make"
          name="make"
          value={formValues.make}
          onChange={handleInputChange}
          required
          className="mt-1 block w-full"
        />
      </div>

      <div>
        <label
          htmlFor="model"
          className="block text-sm font-medium text-gray-700"
        >
          Model
        </label>
        <input
          type="text"
          id="model"
          name="model"
          value={formValues.model}
          onChange={handleInputChange}
          required
          className="mt-1 block w-full"
        />
      </div>

      <div>
        <label
          htmlFor="year"
          className="block text-sm font-medium text-gray-700"
        >
          Year
        </label>
        <input
          type="number"
          id="year"
          name="year"
          value={formValues.year}
          onChange={handleInputChange}
          required
          className="mt-1 block w-full"
        />
      </div>

      <div>
        <label
          htmlFor="location"
          className="block text-sm font-medium text-gray-700"
        >
          Location
        </label>
        <input
          type="text"
          id="location"
          name="location"
          value={formValues.location}
          onChange={handleInputChange}
          className="mt-1 block w-full"
        />
      </div>

      <div>
        <label
          htmlFor="price"
          className="block text-sm font-medium text-gray-700"
        >
          Price Per Day
        </label>
        <input
          type="number"
          id="price"
          name="price"
          value={formValues.price}
          onChange={handleInputChange}
          required
          className="mt-1 block w-full"
        />
      </div>

      <div>
        <label
          htmlFor="type"
          className="block text-sm font-medium text-gray-700"
        >
          Type
        </label>
        <input
          type="text"
          id="type"
          name="type"
          value={formValues.type}
          onChange={handleInputChange}
          className="mt-1 block w-full"
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <input
          id="description"
          name="description"
          value={formValues.description}
          onChange={handleInputChange}
          className="mt-1 block w-full"
        />
      </div>

      <div className="flex justify-between">
        <Button type="submit" disabled={isSubmitting}>
          Save Changes
        </Button>
        <Button onClick={onClose} variant="outline">
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default EditCarForm;
