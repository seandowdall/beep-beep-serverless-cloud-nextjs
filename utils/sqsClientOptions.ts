import { SQSClient } from "@aws-sdk/client-sqs";

// Configure and export the SQS client
const sqsClient = new SQSClient({
  region: "eu-west-1",
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID as string,
    secretAccessKey: process.env.SECRET_ACCESS_KEY as string,
  },
});

export { sqsClient };
