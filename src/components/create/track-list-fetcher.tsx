"use server";

import { redirect } from "next/navigation";
// import { getThumbnailUrl } from "~/actions/generation";
import { auth } from "~/auth";
import { db } from "~/server/db";
import { TrackList } from "./track-list";

export default async function TrackListFetcher() {
  const session = await auth()
  if (!session) {
    redirect("/auth/sign-in");
  }

  const songs = await db.song.findMany({
    where: { userId: session?.user?.id },
    include: {
      user: {
        select: { name: true },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const songsWithThumbnails = await Promise.all(
    songs.map(async (song) => {
      const thumbnailUrl = song.thumbnailPath
        ? song.thumbnailPath
        : null;

      return {
        id: song.id,
        title: song.title,
        createdAt: song.createdAt,
        instrumental: song.instrumental,
        prompt: song.prompt,
        lyrics: song.lyrics,
        describedLyrics: song.describedLyrics,
        fullDescribedSong: song.fullDescribedSong,
        thumbnailUrl,
        playUrl: null,
        status: song.status,
        createdByUserName: song.user?.name,
        published: song.published,
      };
    }),
  );

  return <TrackList tracks={songsWithThumbnails} />;
}
