import { google, youtube_v3 } from "googleapis";
import { NextResponse } from "next/server";
import fs from "fs";
import { getServerSession } from "next-auth/next";
import { authConfig } from "@/lib/auth";

const auth = new google.auth.OAuth2({
  clientId: process.env.GOOGLE_CLIENT_ID as string,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
  redirectUri: "http://localhost:3000/api/auth/callback/google",
});

const youtube = google.youtube({
  version: "v3",
  auth: auth,
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const title = formData.get("title");
    const description = formData.get("description");
    const media = formData.get("media") as File;

    if (!title || !description || !media) {
      return new NextResponse("Important data/field missing", { status: 402 });
    }

    const session = await getServerSession(authConfig);
    auth.setCredentials({
      access_token:
        "ya29.a0Ad52N39CUGbQSW_EA__M0mTzbegAa5NKjbvVBju9K4VAsWPH-38uocKdb1Yv9hqI_T15oedl18JYNP42GTx2yl06Ni1Hw-n_8yYQDC4DUtNzBGv3sBjK9b2nyA6d0m3BCE5vu3h4i7ypoz8RtpFVI6_US7oH-irTHr4zaCgYKAboSARISFQHGX2MilqHZsWoTpvv_OHl2bVYZuQ0171",
    });
    if (session) {
      console.log(session.token);
    }
    const tempFilePath = "public/video/demo.mp4";
    const readStream = await fs.promises.readFile(tempFilePath);
    const arrayBuffer = await media.arrayBuffer();
    await fs.promises.writeFile(tempFilePath, Buffer.from(arrayBuffer));
    const youtube_response = await (
      youtube.videos.insert as (
        params: youtube_v3.Params$Resource$Videos$Insert
      ) => Promise<youtube_v3.Schema$Video>
    )({
      part: ["snippet", "status"],
      requestBody: {
        snippet: {
          title: title as string,
          description: description as string,
        },
        status: {
          privacyStatus: "public",
        },
      },
      media: {
        mimeType: media.type,
        body: fs.createReadStream(tempFilePath),
      },
    });

    await fs.promises.writeFile(tempFilePath, readStream);
    return NextResponse.json(youtube_response);
  } catch (err) {
    console.log("Server Error", err);
    return new NextResponse("Failed to upload error", { status: 500 });
  }
}
