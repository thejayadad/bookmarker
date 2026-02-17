import { createBookmark } from "@/lib/actions";
import {
  FiMenu,
  FiSearch,
  FiChevronDown,
  FiPlus,
  FiUpload,
} from "react-icons/fi";

type HeaderProps = {
  title?: string;
  placeholder?: string;
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function IconButton({
  children,
  className,
  title,
  htmlFor,
}: {
  children: React.ReactNode;
  className?: string;
  title?: string;
  htmlFor?: string;
}) {
  const base =
    "inline-flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50";
  if (htmlFor) {
    return (
      <label
        htmlFor={htmlFor}
        className={cx(base, "cursor-pointer lg:hidden", className)}
        aria-label={title ?? "Toggle"}
        title={title}
      >
        {children}
      </label>
    );
  }
  return (
    <button type="button" className={cx(base, className)} title={title}>
      {children}
    </button>
  );
}

function Segmented({
  items,
}: {
  items: Array<{ label: string; active?: boolean }>;
}) {
  return (
    <div className="hidden items-center gap-1 rounded-xl border border-neutral-200 bg-white p-1 sm:flex">
      {items.map((it) => (
        <button
          key={it.label}
          type="button"
          className={cx(
            "rounded-lg px-2 py-1 text-xs font-bold transition",
            it.active
              ? "bg-neutral-100 text-neutral-900"
              : "text-neutral-600 hover:bg-neutral-50"
          )}
        >
          {it.label}
        </button>
      ))}
    </div>
  );
}

type ServerAction = (formData: FormData) => void | Promise<void>;

function AddDropdown({ action }: { action: ServerAction }) {
  return (
    <details className="relative">
      <summary
        className={cx(
          "flex cursor-pointer list-none items-center gap-2 rounded-xl",
          "bg-neutral-600 px-3 py-2 text-sm font-extrabold text-white",
          "hover:bg-neutral-700"
        )}
      >
        <span className="inline-flex items-center gap-2">
          <FiPlus className="text-base" />
          <span className="hidden sm:inline">Add</span>
        </span>
        <FiChevronDown className="text-base opacity-90" />
      </summary>

      <div
        className={cx(
          "absolute right-0 mt-2 w-80 overflow-hidden rounded-2xl",
          "border border-neutral-200 bg-white shadow-sm"
        )}
      >
        {/* ✅ server action */}
        <form action={action} className="p-3">
          <div className="mb-1 text-xs font-bold text-neutral-500">Add URL</div>

          <input
            name="url"
            placeholder="https://example.com"
            className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-400"
            required
          />

          <input
            name="title"
            placeholder="Title (optional)"
            className="mt-2 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-400"
          />

          {/* optional for later */}
          <input type="hidden" name="category" value="Unsorted" />

          <button
            type="submit"
            className="mt-3 w-full rounded-lg bg-neutral-900 px-3 py-2 text-sm font-extrabold text-white hover:bg-neutral-800"
          >
            Save Bookmark
          </button>

          <div className="mt-2 flex items-center justify-between border-t border-neutral-100 pt-2">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg px-2 py-1 text-xs font-bold text-neutral-600 hover:bg-neutral-50"
            >
              <FiUpload />
              Import
            </button>

            <span className="text-[11px] font-semibold text-neutral-400">
              Server action
            </span>
          </div>
        </form>
      </div>
    </details>
  );
}

function SearchBox({ placeholder }: { placeholder: string }) {
  return (
    <div className="max-w-xl flex-1">
      <div className="relative">
        <input
          placeholder={placeholder}
          className={cx(
            "w-full rounded-xl border border-neutral-200 bg-neutral-50",
            "px-10 py-2 text-sm font-semibold text-neutral-800",
            "outline-none focus:border-neutral-400 focus:bg-white"
          )}
        />
        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
          <FiSearch className="text-base" />
        </div>
      </div>
    </div>
  );
}

export default function Header({
  title = "Bookmarks",
  placeholder = "Search",
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 w-full border-b border-neutral-200 bg-white">
      <div className="flex h-14 items-center justify-between gap-3 px-3 lg:px-6">
        {/* LEFT */}
        <div className="flex items-center gap-2">
          <IconButton htmlFor="nav" title="Open menu">
            <FiMenu className="text-lg" />
          </IconButton>

          <div className="hidden lg:block">
            <div className="text-sm font-extrabold text-neutral-900">{title}</div>
            <div className="text-[11px] font-semibold text-neutral-500">
              Links I actually use
            </div>
          </div>
        </div>

        {/* CENTER */}
        <SearchBox placeholder={placeholder} />

        {/* RIGHT */}
        <div className="flex items-center gap-2">
          <Segmented items={[{ label: "Manual" }, { label: "List", active: true }]} />

          <button className="hidden rounded-xl border border-neutral-200 bg-white px-3 py-2 text-xs font-bold text-neutral-700 hover:bg-neutral-50 sm:inline-flex">
            Export
          </button>

          {/* ✅ pass server action */}
          <AddDropdown action={createBookmark} />
        </div>
      </div>
    </header>
  );
}
