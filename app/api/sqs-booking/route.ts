// Filename: /app/api/sqs-booking/route.ts
import { NextRequest, NextResponse } from "next/server";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { buffer } from "stream/consumers"; // Importing utility to convert stream to buffer

const sqsClient = new SQSClient({ region: "eu-west-1" });

interface BookingDetails {
  carId: string;
  userId: string;
  startDate: string;
  endDate: string;
}

// Use NextRequest and NextResponse for handling requests and responses
export async function POST(request: NextRequest) {
  // Ensure the body is read as a JSON object
  const requestBody = await request.text(); // Use .text() to read the body text directly
  const { carId, userId, startDate, endDate } = JSON.parse(
    requestBody
  ) as BookingDetails;
  const deduplicationId = `${userId}-${carId}-${new Date().getTime()}`;

  const params = {
    QueueUrl: process.env.SQS_QUEUE_URL,
    MessageBody: JSON.stringify({ carId, userId, startDate, endDate }),
    MessageGroupId: "BookingRequests",
    MessageDeduplicationId: deduplicationId,
  };

  try {
    await sqsClient.send(new SendMessageCommand(params));
    return new NextResponse(
      JSON.stringify({ message: "Booking request enqueued" }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error sending message to SQS:", error);
    return new NextResponse(
      JSON.stringify({ message: "Failed to enqueue booking request" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
