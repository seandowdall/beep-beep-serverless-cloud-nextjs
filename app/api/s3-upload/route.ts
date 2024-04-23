// app/api/documents/route.ts
import { NextRequest, NextResponse } from "next/server";

import {
  S3Client,
  ListObjectsCommand,
  PutObjectCommand,
  S3ServiceException,
} from "@aws-sdk/client-s3";

const Bucket = process.env.S3_BUCKET;
const s3 = new S3Client({
  region: process.env.REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

// endpoint to get the list of files in the bucket
export async function GET() {
  const response = await s3.send(new ListObjectsCommand({ Bucket }));
  return NextResponse.json(response?.Contents ?? []);
}

// endpoint to upload a file to the bucket
// endpoint to upload a file to the bucket
export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const files = formData.getAll("file") as File[];

  const keys = await Promise.all(
    files.map(async (file) => {
      const Body = (await file.arrayBuffer()) as Buffer;
      const key = `${Date.now()}-${file.name}`;
      await s3.send(new PutObjectCommand({ Bucket, Key: key, Body }));
      return key; // Return the key for each file
    })
  );

  return NextResponse.json(keys); // Return keys as an array
}
