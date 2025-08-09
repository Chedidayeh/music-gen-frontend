# AI-Powered Music Generation SaaS

## 📌 Core Purpose
Build an AI-powered music generation SaaS where users describe a track or provide lyrics/styles, and the system generates:

- 🎵 A full song using **ACE-Step** with optional lyric alignment  
- 🖼 An album-cover thumbnail via **SDXL Turbo**  
- 🏷 Auto-categorization of the track using an **LLM**  

Provide a streamlined web experience to **create, queue, monitor, play, publish, and download** generated songs.

---

## ✨ Key Features

- **Text-to-music** via ACE-Step with configurable parameters:
  - Duration  
  - Guidance scale  
  - Steps  
  - Seed  
  - Instrumental toggle  

- **Three generation modes**:
  1. Full description only *(auto-prompt + auto-lyrics if not instrumental)*
  2. Prompt + custom lyrics
  3. Prompt + described lyrics *(auto-lyrics from description)*

- Automatic cover art generation (**SDXL Turbo**)  
- Automatic genre/category tagging (**LLM**)  
- Background job orchestration & status tracking *(queued → processing → processed/failed)*  
- Personal library:
  - Search  
  - Play  
  - Publish/Unpublish  
  - Rename  
  - Download  
- Email + password authentication  

---

## 🛠 Technical Stack

### **Frontend**
- **Framework:** Next.js 15 (App Router), React 19, TypeScript  
- **UI:** Tailwind CSS, Radix primitives, custom components under `src/components/ui`  
- **State Management:** Zustand (player store)  
- **Auth:** better-auth with Prisma adapter & custom tables  
- **Job Orchestration:** Inngest (`src/inngest`)  

### **Backend (Model Serving)**
- **Modal serverless GPU app:** `modal.App("music-generator")`
  - ACE-Step music pipeline
  - Qwen2-7B-Instruct for prompt/lyrics/category generation
  - SDXL Turbo for thumbnail images
- **API:** Pydantic-based request/response models, FastAPI-like endpoints via Modal

### **Data & Storage**
- **Database:** PostgreSQL via Prisma  
- **Storage:** Supabase Storage (`music-bucket`) for audio & thumbnails  

---

## 🔄 Flow Overview

1. **User Action:** Creates a `Song` DB record & emits an **Inngest** event.  
2. **Inngest Handler:** Selects the appropriate Modal endpoint & sends a generation request.  
3. **Modal Worker:**
   - Runs ACE-Step to create audio  
   - Runs SDXL Turbo to create image  
   - Uses LLM to generate categories  
   - Uploads assets to Supabase  
4. **Backend:** Returns storage paths & categories.  
5. **Frontend:** Updates `Song` record with URLs & connected category relations.  

---

## 📂 Data Models

### **User**
- Core profile info  
- Auth relationships (Session, Account)  
- Relations: songs, likes  

### **Song**
- **Fields:** `id`, `title`, `status` (`queued` | `processing` | `processed` | `failed`), `published`  
- **Input Params:** `instrumental`, `prompt`, `lyrics`, `fullDescribedSong`, `describedLyrics`, `guidanceScale`, `inferStep`, `audioDuration`, `seed`  
- **Output:** `audioPath`, `thumbnailPath`  
- Relations: `user` (owner), `categories`, `likes`  
- Index: `audioPath`  

### **Category**
- `id`, `name` (unique)  
- Many-to-many with Song (auto `connectOrCreate` on generation)  

### **Like**
- Composite key: (`userId`, `songId`)  
- Relations: user, song  

---

## 🎛 UX Flow

### **Create Page** (`/create`)
- **Simple Mode:**
  - One text area to “Describe your song”  
  - Toggle: Instrumental  
  - Optional: “Generate Variations”  

- **Custom Mode:**
  - Lyrics: Write or Auto *(describe lyrics)*  
  - Toggle: Instrumental  
  - Optional: Variations  
  - Styles: Style tags input with quick-add chips  

- **One-click Create:** Queues 1–2 jobs (variations use different guidance scales)  

### **Track List**
- Live search  
- Status-aware track entries:
  - Failed  
  - Queued/Processing (spinners)  
  - Ready  
- Ready tracks:
  - Thumbnail (or placeholder)  
  - Quick Play  
  - Download  
  - Rename  
  - Publish/Unpublish  
- Clicking a track loads it into the **global player store** for playback  

---

## 🎯 Target Audience
- **Creators, producers, hobbyists** → Rapid ideation from descriptions or lyric ideas  
- **Content teams** → On-demand royalty-free audio with auto-tagging & quick thumbnails  
- **Developers** → Integrating generation via Modal endpoints & Supabase-backed assets  
