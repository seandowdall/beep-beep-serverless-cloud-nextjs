import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PencilIcon } from "lucide-react";

// Assuming Car type is defined based on your DynamoDB car rental data structure
import { Car } from "@/types/types";

const CarCard: React.FC<{ car: Car }> = ({ car }) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEditForm = () => setIsEditing(!isEditing);

  const deleteCar = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await fetch(`${apiUrl}/cars/${car.CarID}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete the car.");
      }

      alert("Car deleted successfully.");
      window.location.reload();
    } catch (error) {
      alert((error as Error).message);
    }
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>
            {car.Make} {car.Model} - {car.Year}
          </CardTitle>
          <CardDescription>{car.Description}</CardDescription>
          {car.Images && car.Images.length > 0 && (
            <img
              width={200}
              height={200}
              src={car.Images[0]} // Assuming showing only one image for simplicity
              alt={`${car.Make} ${car.Model}`}
              style={{ borderRadius: "8px" }}
            />
          )}
        </CardHeader>
        <CardContent>
          <ul>
            <li>Car ID: {car.CarID}</li>
            <li>Location: {car.Location}</li>
            <li>Price: ${car.Price} per day</li>
            <li>
              Availability: {car.Availability ? "Available" : "Not Available"}
            </li>
            <li>Type: {car.Type}</li>
            {car.Features &&
              car.Features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
          </ul>
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </div>
  );
};

export default CarCard;
