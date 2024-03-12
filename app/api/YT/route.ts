import { google, youtube_v3 } from "googleapis";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import { getToken } from "next-auth/jwt";
const auth = new google.auth.OAuth2({
  clientId: process.env.GOOGLE_CLIENT_ID as string,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
  redirectUri: "http://localhost:3000/api/auth/callback/google",
});

const youtube = google.youtube({
  version: "v3",
  auth: auth,
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const title = formData.get("title");
    const description = formData.get("description");
    const media = formData.get("media") as File;

    if (!title || !description || !media) {
      return new NextResponse("Important data/field missing", { status: 402 });
    }

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    console.log(token?.accessToken);
    if (!token?.accessToken) {
      return new NextResponse("Unauthorized", { status: 404 });
    }
    auth.setCredentials({
      access_token: token.accessToken,
    });

    const tempFilePath = "public/video/demo.mp4";
    const readStream = await fs.promises.readFile(tempFilePath);
    const arrayBuffer = await media.arrayBuffer();
    await fs.promises.writeFile(tempFilePath, Buffer.from(arrayBuffer));
    const youtube_response = await youtube.videos.insert({
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
    return NextResponse.json(youtube_response.data);
  } catch (err) {
    console.log("Server Error", err);
    return new NextResponse("Failed to upload error", { status: 500 });
  }
}
