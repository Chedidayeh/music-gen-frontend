/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Inngest } from "inngest";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "music-generator" });
