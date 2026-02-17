
import Link from "next/link";
import { FiEdit2, FiExternalLink, FiTrash2 } from "react-icons/fi";

type BookmarkRowProps = {
  id: string;
  title: string;
  url: string;
  category: string;
  onDelete: (formData: FormData) => void | Promise<void>;
};

function host(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "link";
  }
}

export default function BookmarkRow({
  id,
  title,
  url,
  category,
  onDelete,
}: BookmarkRowProps) {
  const domain = host(url);
  const displayTitle = title?.trim() ? title : domain;

  return (
    <div className="group rounded-xl border border-transparent px-3 py-3 hover:border-neutral-200 hover:bg-white hover:shadow-sm transition">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-neutral-200/70 text-xs font-black text-neutral-700">
          {domain.slice(0, 2).toUpperCase()}
        </div>

        {/* Clicking row opens details (right panel in your split layout) */}
        <Link href={`/bookmarks/${id}`} className="min-w-0 flex-1">
          <div className="truncate text-sm font-extrabold text-neutral-900">
            {displayTitle}
          </div>

          <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-neutral-500">
            <span className="font-semibold text-neutral-600">{domain}</span>
            <span className="text-neutral-300">•</span>
            <span className="truncate">{url}</span>


          </div>
        </Link>

        {/* Hover actions (desktop) */}
      {/* Desktop hover actions */}
<div className="hidden items-center gap-2 opacity-0 transition group-hover:opacity-100 sm:flex">
  <Link
    href={url}
    target="_blank"
    rel="noreferrer"
    className="rounded-lg border border-neutral-200 bg-white p-2 text-neutral-700 hover:bg-neutral-50"
    title="Open"
  >
    <FiExternalLink />
  </Link>

  <Link
    href={`/bookmarks/${id}/edit`}
    className="rounded-lg border border-neutral-200 bg-white p-2 text-neutral-700 hover:bg-neutral-50"
    title="Edit"
  >
    <FiEdit2 />
  </Link>

  <form action={onDelete}>
    <input type="hidden" name="id" value={id} />
    <button
      type="submit"
      className="rounded-lg border border-neutral-200 bg-white p-2 text-neutral-700 hover:bg-neutral-50"
      title="Delete"
    >
      <FiTrash2 />
    </button>
  </form>
</div>

{/* Mobile actions (tap to open) */}
<details className="relative sm:hidden">
  <summary className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-700">
    ⋯
  </summary>

  <div className="absolute right-0 z-20 mt-2 w-40 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-lg">
    <Link
      href={url}
      target="_blank"
      rel="noreferrer"
      className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-50"
    >
      <FiExternalLink /> Open
    </Link>

    <Link
      href={`/bookmarks/${id}/edit`}
      className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-50"
    >
      <FiEdit2 /> Edit
    </Link>

    <form action={onDelete}>
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-semibold text-red-600 hover:bg-neutral-50"
      >
        <FiTrash2 /> Delete
      </button>
    </form>
  </div>
</details>

      </div>
    </div>
  );
}
