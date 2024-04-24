import { NextRequest, NextResponse } from "next/server";
import { SendMessageCommand } from "@aws-sdk/client-sqs";
import { sqsClient } from "@/utils/sqsClientOptions"; // Adjust the path as necessary

interface BookingDetails {
  CarID: string;
  userID: string;
  startDate: string;
  endDate: string;
}

// Use NextRequest and NextResponse for handling requests and responses
export async function POST(request: NextRequest) {
  // Ensure the body is read as a JSON object
  const requestBody = await request.text();
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
