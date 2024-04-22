import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Import UI components
import { Booking } from "@/types/types"; // Assuming Booking is a defined type

interface BookingCardProps {
  booking: Booking;
}

const BookingCard: React.FC<BookingCardProps> = ({ booking }) => {
  return (
    <div>
      <Card className="mt-10">
        <CardHeader>
          <CardTitle>{/* {booking.make} {booking.model}  */}</CardTitle>
        </CardHeader>
        <CardContent>
          <ul>
            <li>Booking ID: {booking.BookingID}</li>
            <li>User ID: {booking.userID}</li>
            <li>
              Approval Status: {booking.isApproved ? "Approved" : "Pending"}
            </li>
            <li>Start Date: {booking.startDate}</li>
            <li>End Date: {booking.endDate}</li>
            {/* <li>Total Cost: €{booking.totalCost}</li> */}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingCard;
