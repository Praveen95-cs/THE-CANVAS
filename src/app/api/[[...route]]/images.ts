import { Hono } from "hono";
import { verifyAuth } from "@hono/auth-js";

import { unsplash } from "@/lib/unsplash";

const DEFAULT_COUNT = 50;
const DEFAULT_COLLECTION_IDS = ["317099"];

// Log if Unsplash key is configured
if (!process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY) {
  console.error("⚠️ NEXT_PUBLIC_UNSPLASH_ACCESS_KEY is not set!");
}

const app = new Hono()
  .get("/", verifyAuth(), async (c) => {
    try {
      // Check if access key is configured
      if (!process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY) {
        console.error("[Images API] Unsplash access key is not configured");
        return c.json({ error: "Unsplash API key not configured" }, 500);
      }

      console.log("[Images API] Fetching images from Unsplash...");
      console.log("[Images API] Access key present:", !!process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY);
      console.log("[Images API] Collection IDs:", DEFAULT_COLLECTION_IDS);
      console.log("[Images API] Count:", DEFAULT_COUNT);

      const images = await unsplash.photos.getRandom({
        collectionIds: DEFAULT_COLLECTION_IDS,
        count: DEFAULT_COUNT,
      });

      console.log("[Images API] Response received");
      console.log("[Images API] Has errors:", !!images.errors);
      console.log("[Images API] Has response:", !!images.response);

      if (images.errors) {
        console.error("[Images API] Unsplash API errors:", JSON.stringify(images.errors, null, 2));
        return c.json({ error: "Failed to fetch images from Unsplash", details: images.errors }, 400);
      }

      let response = images.response;

      if (!Array.isArray(response)) {
        response = [response];
      }

      console.log("[Images API] Returning", response.length, "images");
      return c.json({ data: response });
    } catch (error) {
      console.error("[Images API] Exception:", error);
      return c.json({ error: "Failed to load images", details: error instanceof Error ? error.message : String(error) }, 500);
    }
  });

export default app;
