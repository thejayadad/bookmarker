"use server";

import { revalidatePath } from "next/cache";
import { dbConnect } from "@/lib/mongodb";
import { Bookmark } from "@/models/Bookmark";

function normalizeUrl(url: string) {
  const trimmed = url.trim();
  if (!trimmed) return "";
  if (!/^https?:\/\//i.test(trimmed)) return `https://${trimmed}`;
  return trimmed;
}

export async function createBookmark(formData: FormData) {
  const title = String(formData.get("title") || "").trim();
  const url = normalizeUrl(String(formData.get("url") || ""));


  if (!title) throw new Error("Title is required");
  if (!url) throw new Error("URL is required");

  await dbConnect();
  await Bookmark.create({ title, url,  });

  revalidatePath("/bookmarks");
}

export async function deleteBookmark(formData: FormData) {
  const id = String(formData.get("id") || "");
  if (!id) return;

  await dbConnect();
  await Bookmark.findByIdAndDelete(id);

  revalidatePath("/bookmarks");
}

export async function updateBookmark(formData: FormData) {
  const id = String(formData.get("id") || "");
  const titleField = formData.get("title");
  const urlField = formData.get("url");
  const noteField = formData.get("note");
  const tagsField = formData.get("tags");

  if (!id) throw new Error("Missing id");

  const update: {
    title?: string;
    url?: string;
    note?: string;
    tags?: string[];
  } = {};

  if (titleField !== null) {
    const title = String(titleField).trim();
    if (!title) throw new Error("Title is required");
    update.title = title;
  }

  if (urlField !== null) {
    const url = normalizeUrl(String(urlField));
    if (!url) throw new Error("URL is required");
    update.url = url;
  }



  if (noteField !== null) {
    update.note = String(noteField || "").trim();
  }

  if (tagsField !== null) {
    update.tags = String(tagsField || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }

  await dbConnect();
  await Bookmark.findByIdAndUpdate(id, update);

  revalidatePath("/bookmarks");
}
