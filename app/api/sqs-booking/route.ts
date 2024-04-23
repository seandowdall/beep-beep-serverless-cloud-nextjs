// Filename: /app/api/sqs-booking/route.ts
import { NextRequest, NextResponse } from "next/server";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { buffer } from "stream/consumers"; // Importing utility to convert stream to buffer

const sqsClient = new SQSClient({
  region: "eu-west-1",
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID as string,
    secretAccessKey: process.env.SECRET_ACCESS_KEY as string,
  },
});

interface BookingDetails {
  CarID: string;
  userID: string;
  startDate: string;
  endDate: string;
}

// Use NextRequest and NextResponse for handling requests and responses
export async function POST(request: NextRequest) {
  // Ensure the body is read as a JSON object
  const requestBody = await request.text(); // Use .text() to read the body text directly
  const { CarID, userID, startDate, endDate } = JSON.parse(
    requestBody
  ) as BookingDetails;

  if (!CarID || typeof CarID !== "string" || CarID.trim() === "") {
    return new NextResponse(
      JSON.stringify({ message: "Invalid CarID provided" }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  const deduplicationId = `${userID}-${CarID}-${new Date().getTime()}`;

  const params = {
    QueueUrl: process.env.SQS_QUEUE_URL,
    MessageBody: JSON.stringify({ CarID, userID, startDate, endDate }),
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
