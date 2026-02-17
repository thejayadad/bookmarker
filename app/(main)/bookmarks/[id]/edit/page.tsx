import { deleteBookmark, updateBookmark } from "@/lib/actions";
import { dbConnect } from "@/lib/mongodb";
import { Bookmark } from "@/models/Bookmark";
import mongoose from "mongoose";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";

type BookmarkLean = {
  _id: mongoose.Types.ObjectId | string;
  title?: string;
  url?: string;
  category?: string;
  note?: string;
  tags?: string[];
};

type PageParams = { id?: string | string[] };

export default async function EditBookmarkPage({
  params,
}: {
  params: PageParams | Promise<PageParams>;
}) {
  await dbConnect();

  const resolvedParams = await Promise.resolve(params);
  const paramId = Array.isArray(resolvedParams?.id)
    ? resolvedParams?.id[0]
    : resolvedParams?.id;

  const rawId = typeof paramId === "string" ? decodeURIComponent(paramId) : "";

  if (!rawId || rawId === "undefined" || rawId === "null") {
    return <div className="p-8">Not found</div>;
  }

  let doc: BookmarkLean | null = null;

  if (mongoose.Types.ObjectId.isValid(rawId)) {
    doc = await Bookmark.findById(rawId).lean<BookmarkLean>();
  }
  if (!doc) {
    doc = await Bookmark.findOne({ _id: rawId }).lean<BookmarkLean>();
  }
  if (!doc) return <div className="p-8">Not found</div>;

  const b = doc;

  return (
    <div className="min-h-screen bg-neutral-100">
      {/* top bar */}
      <div className="sticky top-0 z-10 border-b border-neutral-200 bg-white">
        <div className="mx-auto flex h-14 w-[min(920px,92vw)] items-center justify-between">
          <Link
            href="/bookmarks"
            className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm font-extrabold text-neutral-800 hover:bg-neutral-50"
          >
            <FiArrowLeft /> Back
          </Link>

          <div className="text-sm font-extrabold text-neutral-900">Edit bookmark</div>

          <div className="w-[84px]" />
        </div>
      </div>

      {/* card */}
      <div className="mx-auto max-w-5xl sm:px-4 lg:px-0 py-10">
        <div className="rounded-md border border-neutral-200 bg-white shadow-sm">
          <div className="border-b border-neutral-200 px-5 py-4">
            <div className="text-sm font-extrabold text-neutral-900">
              {b.title || "Bookmark"}
            </div>
            <div className="mt-1 text-xs font-semibold text-neutral-500 break-all">
              {b.url}
            </div>
          </div>

          <div className="p-5">
            <form id="updateForm" action={updateBookmark} className="grid gap-4">
              <input type="hidden" name="id" value={String(b._id)} />

              <Field label="Title">
                <input
                  name="title"
                  defaultValue={b.title ?? ""}
                  className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-400"
                />
              </Field>

              <Field label="Collection">
                <input
                  name="category"
                  defaultValue={b.category ?? "Unsorted"}
                  className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-400"
                />
              </Field>

              <Field label="Tags">
                <input
                  name="tags"
                  defaultValue={(b.tags ?? []).join(", ")}
                  className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-400"
                />
              </Field>

              <Field label="URL">
                <input
                  name="url"
                  defaultValue={b.url ?? ""}
                  className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-400"
                />
              </Field>

              <Field label="Note">
                <textarea
                  name="note"
                  defaultValue={b.note ?? ""}
                  className="h-28 w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-400"
                />
              </Field>
            </form>

            <form id="deleteForm" action={deleteBookmark}>
              <input type="hidden" name="id" value={String(b._id)} />
            </form>

            <div className="mt-8 flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="submit"
                form="deleteForm"
                className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-extrabold text-rose-600 hover:bg-neutral-50"
              >
                Delete
              </button>

              <div className="flex gap-2">
                <Link
                  href="/bookmarks"
                  className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-extrabold hover:bg-neutral-50"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  form="updateForm"
                  className="rounded-xl bg-neutral-900 px-4 py-2 text-sm font-extrabold text-white hover:bg-neutral-800"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* small footer */}
        <div className="mt-4 text-center text-xs font-semibold text-neutral-500">
          Tip: paste a URL like <span className="font-mono">google.com</span> and we can auto-normalize later.
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-1">
      <div className="text-xs font-bold text-neutral-600">{label}</div>
      {children}
    </div>
  );
}
