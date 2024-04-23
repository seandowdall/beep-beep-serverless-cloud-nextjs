import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"; // Import UI components
import { Booking } from "@/types/types"; // Assuming Booking is a defined type
import DeleteAlertDialog from "@/components/delete-alert-dialog";

interface BookingCardProps {
  booking: Booking;
}

const BookingCard: React.FC<BookingCardProps> = ({ booking }) => {
  return (
    <div>
      <Card className="mt-3">
        <CardContent className="mt-5">
          <ul>
            <li className="text-xl mb-1">Booking ID: {booking.BookingID}</li>
            <li className="text-xl mb-1">Email: {booking.userID}</li>
            <li className="text-xl mb-1">
              Approval Status: {booking.isApproved ? "Approved" : "Pending"}
            </li>
            <li className="text-xl mb-1">Start Date: {booking.startDate}</li>
            <li className="text-xl mb-1">End Date: {booking.endDate}</li>
            {/* <li>Total Cost: €{booking.totalCost}</li> */}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingCard;
