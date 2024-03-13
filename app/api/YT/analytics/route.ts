import { NextRequest, NextResponse } from "next/server";
import { google, youtube_v3 } from "googleapis";
import { getToken } from "next-auth/jwt";

const auth = new google.auth.OAuth2({
  clientId: process.env.GOOGLE_CLIENT_ID as string,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
  redirectUri: "http://localhost:3000/api/auth/callback/google",
});

const youtubeAnalytics = google.youtube({
  version: "v3",
  auth: auth,
});

export async function GET(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });
  if (!token?.accessToken) {
    return new NextResponse("Unauthorized", { status: 401 });
  }
  auth.setCredentials({
    access_token: token.accessToken,
  });

  const channelList = await youtubeAnalytics.channels.list({
    part: ["contentDetails", "snippet", "statistics"],
    mine: true,
  });
  const uploadsId =
    channelList.data.items?.[0].contentDetails?.relatedPlaylists?.uploads;
  if (!uploadsId) {
    return new NextResponse("No uploads found", { status: 400 });
  }
  const playListItems = await youtubeAnalytics.playlistItems.list({
    part: ["contentDetails"],
    playlistId: uploadsId,
    maxResults: 13,
  });
  const videoIds: string[] = [];
  playListItems.data.items?.map((item) => {
    videoIds.push(item.contentDetails?.videoId as string);
  });
  const videosResponse = await youtubeAnalytics.videos.list({
    part: ["snippet", "statistics"],
    id: videoIds,
  });
  const response: any = [];
  videosResponse.data.items?.map((item) => {
    const schema: {
      snippet: any;
      statistics: any;
    } = { snippet: item.snippet, statistics: item.statistics };

    response.push(schema);
  });
  return NextResponse.json({ response, channelList });
}
