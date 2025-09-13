import { Loader2 } from "lucide-react";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { auth } from "~/auth";
import { SongPanel } from "~/components/create/song-panel";
import TrackListFetcher from "~/components/create/track-list-fetcher";

export default async function Page() {
  const session = await auth()

  if (!session) {
    redirect("/auth/sign-in");
  }

  return (
    <div className="flex h-full flex-col lg:flex-row bg-white ">
      <SongPanel />
      <Suspense
        fallback={
          <div className="flex h-full w-full items-center justify-center bg-white">
            <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
          </div>
        }
      >
        <TrackListFetcher />
      </Suspense>
    </div>
  );
}
