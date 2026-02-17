export default function EmptyState() {
  return (
    <div className="flex h-[calc(100vh-56px)] items-start justify-center px-6 pt-20">
      <div className="text-center">
        <div className="text-lg font-extrabold text-neutral-900">No bookmarks</div>
        <div className="mt-1 text-sm font-semibold text-neutral-600">
          Add link or drop file here.
        </div>

        <div className="mt-6 flex flex-col items-center gap-3">
          <button
            type="button"
            className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-extrabold text-neutral-800 hover:bg-neutral-50"
          >
            Install browser extension
          </button>

          <button
            type="button"
            className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-extrabold text-neutral-800 hover:bg-neutral-50"
          >
            Import bookmarks
          </button>
        </div>
      </div>
    </div>
  );
}
