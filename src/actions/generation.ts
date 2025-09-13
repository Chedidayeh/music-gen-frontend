"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "~/auth";
import { inngest } from "~/inngest/client";
import { db } from "~/server/db";
// import { supabase } from "~/lib/supabase";

export interface GenerateRequest {
  prompt?: string;
  lyrics?: string;
  fullDescribedSong?: string;
  describedLyrics?: string;
  instrumental?: boolean;
}

export async function generateSong(generateRequest: GenerateRequest, generateVariations: boolean = false) {
  const session = await auth()

  if (!session) redirect("/auth/sign-in");

  if (generateVariations) {
    await queueSong(generateRequest, 7.5, session.user.id);
    await queueSong(generateRequest, 15, session.user.id);
  } else {
    await queueSong(generateRequest, 15, session.user.id);
  }

  revalidatePath("/dashboard/create");
}

export async function queueSong(
  generateRequest: GenerateRequest,
  guidanceScale: number,
  userId: string,
) {
  let title = "Untitled";
  if (generateRequest.describedLyrics) title = generateRequest.describedLyrics;
  if (generateRequest.fullDescribedSong)
    title = generateRequest.fullDescribedSong;

  title = title.charAt(0).toUpperCase() + title.slice(1);

  const song = await db.song.create({
    data: {
      userId: userId,
      title: title,
      prompt: generateRequest.prompt,
      lyrics: generateRequest.lyrics,
      describedLyrics: generateRequest.describedLyrics,
      fullDescribedSong: generateRequest.fullDescribedSong,
      instrumental: generateRequest.instrumental,
      guidanceScale: guidanceScale,
      audioDuration: 60,
    },
  });

  await inngest.send({
    name: "generate-song-event",
    data: { songId: song.id, userId: song.userId },
  });
}

export async function getPlayUrl(songId: string) {
  const session = await auth()

  if (!session) redirect("/auth/sign-in");

  const song = await db.song.findUniqueOrThrow({
    where: {
      id: songId,
      OR: [{ userId: session.user.id }, { published: true }],
      audioPath: {
        not: null,
      },
    },
    select: {
      audioPath: true,
    },
  });

  await db.song.update({
    where: {
      id: songId,
    },
    data: {
      listenCount: {
        increment: 1,
      },
    },
  });

  return song.audioPath

  // return await getPresignedUrl(song.audioPath!);
}

// export async function getPresignedUrl(key: string) {
//   const { data, error } = await supabase.storage
//     .from('music-bucket')
//     .createSignedUrl(key, 3600);

//   if (error) {
//     throw new Error(`Failed to get signed URL: ${error.message}`);
//   }

//   return data.signedUrl;
// }

// export async function getThumbnailUrl(key: string) {
//   const { data, error } = await supabase.storage
//     .from('music-bucket')
//     .createSignedUrl(key, 3600);

//   if (error) {
//     throw new Error(`Failed to get thumbnail URL: ${error.message}`);
//   }

//   return data.signedUrl;
// }
