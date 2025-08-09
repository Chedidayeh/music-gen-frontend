import { db } from "~/server/db";
import { inngest } from "./client";
import { env } from "~/env";

export const generateSong = inngest.createFunction(
  {
    id: "generate-song",
    concurrency: {
      limit: 1,
      key: "event.data.userId",
    },
    onFailure: async ({ event }) => {
      await db.song.update({
        where: {
          id: (event?.data?.event?.data as { songId: string }).songId,
        },
        data: {
          status: "failed",
        },
      });
    },
  },
  { event: "generate-song-event" },
  async ({ event, step }) => {
    const { songId } = event.data as {
      songId: string;
      userId: string;
    };

    const { endpoint, body } = await step.run(
      "prepare-generation",
      async () => {
        const song = await db.song.findUniqueOrThrow({
          where: {
            id: songId,
          },
          select: {
            prompt: true,
            lyrics: true,
            fullDescribedSong: true,
            describedLyrics: true,
            instrumental: true,
            guidanceScale: true,
            inferStep: true,
            audioDuration: true,
            seed: true,
          },
        });

        type RequestBody = {
          guidance_scale?: number;
          infer_step?: number;
          audio_duration?: number;
          seed?: number;
          full_described_song?: string;
          prompt?: string;
          lyrics?: string;
          described_lyrics?: string;
          instrumental?: boolean;
        };

        let endpoint = "";
        let body: RequestBody = {};

        const commomParams = {
          guidance_scale: song.guidanceScale ?? undefined,
          infer_step: song.inferStep ?? undefined,
          audio_duration: song.audioDuration ?? undefined,
          seed: song.seed ?? undefined,
          instrumental: song.instrumental ?? undefined,
        };

        // Description of a song
        if (song.fullDescribedSong) {
          endpoint = env.GENERATE_FROM_DESCRIPTION;
          body = {
            full_described_song: song.fullDescribedSong,
            ...commomParams,
          };
        }

        // Custom mode: Lyrics + prompt
        else if (song.lyrics && song.prompt) {
          endpoint = env.GENERATE_WITH_LYRICS;
          body = {
            lyrics: song.lyrics,
            prompt: song.prompt,
            ...commomParams,
          };
        }

        // Custom mode: Prompt + described lyrics
        else if (song.describedLyrics && song.prompt) {
          endpoint = env.GENERATE_FROM_DESCRIBED_LYRICS;
          body = {
            described_lyrics: song.describedLyrics,
            prompt: song.prompt,
            ...commomParams,
          };
        }

        return {
          endpoint: endpoint,
          body: body,
        };
      },
    );

    // Generate the song
    await step.run("set-status-processing", async () => {
      return await db.song.update({
        where: {
          id: songId,
        },
        data: {
          status: "processing",
        },
      });
    });

    const response = await step.fetch(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        "Modal-Key": env.MODAL_KEY,
        "Modal-Secret": env.MODAL_SECRET,
      },
    });

    await step.run("update-song-result", async () => {
      const responseData = response.ok
        ? ((await response.json()) as {
          storage_path: string;
          cover_image_storage_path: string;
          categories: string[];
        })
        : null;

      // Format storage paths with Supabase URL
      const audioPath = responseData?.storage_path 
        ? `${env.SUPABASE_URL}${responseData.storage_path}`
        : null;
      const thumbnailPath = responseData?.cover_image_storage_path
        ? `${env.SUPABASE_URL}${responseData.cover_image_storage_path}`
        : null;

      await db.song.update({
        where: {
          id: songId,
        },
        data: {
          audioPath,
          thumbnailPath,
          status: response.ok ? "processed" : "failed",
        },
      });

      if (responseData && responseData.categories.length > 0) {
        await db.song.update({
          where: { id: songId },
          data: {
            categories: {
              connectOrCreate: responseData.categories.map(
                (categoryName) => ({
                  where: { name: categoryName },
                  create: { name: categoryName },
                }),
              ),
            },
          },
        });
      }
    });
  },
);
