import BookmarkRow from "@/_components/BookmarkRow";
import EmptyState from "@/_components/EmptyState";
import { deleteBookmark } from "@/lib/actions";
import { dbConnect } from "@/lib/mongodb";
import { Bookmark } from "@/models/Bookmark";


type BookmarkLean = {
  _id: { toString(): string } | string;
  title?: string;
  url?: string;
  category?: string;
  createdAt?: Date;
};

export default async function BookmarksListSlot() {
  await dbConnect();

  const docs = await Bookmark.find({})
    .sort({ createdAt: -1 })
    .lean<BookmarkLean[]>();

  const bookmarks = docs.map((b) => ({
    id: String(b._id),
    title: b.title ?? "",
    url: b.url ?? "",
    category: b.category ?? "Unsorted",
    createdAt: b.createdAt ?? new Date(),
  }));

  return (
    <div className="h-full">

      {/* empty state */}
      {bookmarks.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="p-2">
          <div className="px-2 py-2 text-xs font-semibold text-neutral-500">
            {bookmarks.length} bookmark{bookmarks.length === 1 ? "" : "s"}
          </div>

          <div className="space-y-1">
            {bookmarks.map((b) => (
              <BookmarkRow
                key={b.id}
                id={b.id}
                title={b.title}
                url={b.url}
                category={b.category}
                onDelete={deleteBookmark}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
