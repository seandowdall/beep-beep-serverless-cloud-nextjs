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
import { Car } from "@/types/types";
import Link from "next/link";
import { useSession } from "next-auth/react";

const CarCard: React.FC<{ car: Car }> = ({ car }) => {
  const { data: session } = useSession();
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

  const bookingLink = session ? `/car/${car.CarID}` : "/api/auth/signin";

  return (
    <div>
      <Card className="h-[600px]">
        <CardHeader>
          <CardTitle>
            {car.make} {car.model} - {car.year}
          </CardTitle>
          <CardDescription>{car.description}</CardDescription>
          {car.images && car.images.length > 0 && (
            <img
              width={200}
              height={200}
              src={car.images[0]} // Assuming showing only one image for simplicity
              alt={`${car.make} ${car.model}`}
              style={{ borderRadius: "8px" }}
            />
          )}
        </CardHeader>
        <CardContent>
          <ul>
            <li>Car ID: {car.CarID}</li>
            <li>Location: {car.location}</li>
            <li>Price: €{car.price} per day</li>
            <li>
              Availability: {car.availability ? "Available" : "Not Available"}
            </li>
            <li>Type: {car.type}</li>
            {car.features &&
              car.features.slice(0, 3).map(
                (
                  feature,
                  index // Only show the first three features
                ) => <li key={index}>{feature}</li>
              )}
          </ul>
        </CardContent>
        <CardFooter>
          <Link href={bookingLink}>
            <Button>Book</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CarCard;
