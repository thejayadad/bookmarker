import { dbConnect } from "@/lib/mongodb";
import { Bookmark } from "@/models/Bookmark";
import mongoose from "mongoose";
import Link from "next/link";
import { FiExternalLink, FiEdit2 } from "react-icons/fi";

function cleanId(v: unknown) {
  const s = String(v ?? "").trim();
  if (!s || s === "undefined" || s === "null") return "";
  return s;
}

export default async function BookmarkDetails({ id }: { id: string }) {
  const rawId = cleanId(id);

  // ✅ ABSOLUTE GUARD: never touch Mongo unless we have a real id
  if (!rawId) {
    return (
      <div className="p-10">
        <div className="text-lg font-extrabold">Select a bookmark</div>
        <div className="mt-1 text-sm text-neutral-600">
          Click one on the left to view details.
        </div>
      </div>
    );
  }

  await dbConnect();

  let doc: any = null;

  // ObjectId route
  if (mongoose.Types.ObjectId.isValid(rawId)) {
    doc = await Bookmark.findById(rawId).lean();
  } else {
    // String _id route (only if NOT an ObjectId)
    doc = await Bookmark.findOne({ _id: rawId as any }).lean();
  }

  if (!doc) {
    return (
      <div className="p-10">
        <div className="text-lg font-extrabold">Bookmark not found</div>
        <div className="mt-2 rounded-xl border border-neutral-200 bg-white p-3 font-mono text-sm">
          {rawId}
        </div>
      </div>
    );
  }

  const b = doc;
  const url = String(b.url ?? "");

  return (
    <div className="p-10">
      <div className="text-xl font-extrabold">{b.title || url}</div>
      <div className="mt-2 text-sm text-neutral-600 break-all">{url}</div>

      <div className="mt-6 flex gap-2">
        <Link
          href={url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm font-bold hover:bg-neutral-50"
        >
          <FiExternalLink /> Open
        </Link>

        <Link
          href={`/bookmarks/${rawId}/edit`}
          className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm font-bold hover:bg-neutral-50"
        >
          <FiEdit2 /> Edit
        </Link>
      </div>
    </div>
  );
}
