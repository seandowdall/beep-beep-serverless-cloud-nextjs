import type { NextApiRequest, NextApiResponse } from "next";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

const sqsClient = new SQSClient({ region: "eu-west-1" });

interface BookingDetails {
  carId: string;
  userId: string;
  startDate: string;
  endDate: string;
}

interface ApiResponse {
  message: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  const { carId, userId, startDate, endDate } = req.body as BookingDetails;
  const params = {
    QueueUrl: process.env.SQS_QUEUE_URL, // Make sure to set this in your .env
    MessageBody: JSON.stringify({ carId, userId, startDate, endDate }),
  };

  try {
    await sqsClient.send(new SendMessageCommand(params));
    res.status(200).json({ message: "Booking request enqueued" });
  } catch (error) {
    console.error("Error sending message to SQS:", error);
    res.status(500).json({ message: "Failed to enqueue booking request" });
  }
}
