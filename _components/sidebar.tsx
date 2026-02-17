import { ReactNode } from "react";
import { FiBookmark, FiInbox, FiTrash2, FiPlus } from "react-icons/fi";

type SidebarItemProps = {
  label: string;
  right?: string;
  active?: boolean;
  icon: ReactNode;
};

type SidebarProps = {
  userInitials: string;
  username: string;
  subtitle: string;
};

export function Sidebar({ userInitials, username, subtitle }: SidebarProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-neutral-900 to-neutral-700 text-sm font-black text-white">
              {userInitials}
            </div>
            <div className="min-w-0">
              <div className="truncate text-sm font-extrabold">{username}</div>
              <div className="truncate text-xs text-neutral-500">{subtitle}</div>
            </div>
          </div>

          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50"
            title="Create collection"
          >
            <FiPlus className="text-neutral-700" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto px-2 pb-3">
        <nav className="space-y-1">
          <SidebarItem
            label="All bookmarks"
            active
            icon={<FiBookmark className="text-neutral-700" />}
          />
          <SidebarItem
            label="Unsorted"
            icon={<FiInbox className="text-neutral-700" />}
          />
          <SidebarItem
            label="Trash"
            icon={<FiTrash2 className="text-neutral-700" />}
          />
        </nav>

        <div className="mt-5 px-2 text-xs font-extrabold uppercase tracking-wide text-neutral-400">
          Collections
        </div>

        <div className="mt-2 flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-neutral-500 hover:bg-neutral-50">
          <FiPlus className="text-neutral-400" />
          <span>New collection</span>
        </div>
      </div>

      <div className="border-t border-neutral-200 p-4 text-xs text-neutral-500">
        Get the most out of
        <div className="font-extrabold text-neutral-700">Raindrop-style Pro</div>
      </div>
    </div>
  );
}

function SidebarItem({ label, right, active, icon }: SidebarItemProps) {
  return (
    <button
      type="button"
      className={[
        "flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-extrabold",
        "transition-all duration-200 hover:-translate-y-px hover:bg-neutral-50",
        active ? "bg-neutral-100 text-neutral-900" : "text-neutral-800",
      ].join(" ")}
    >
      <span className="flex items-center gap-2">
        <span className="text-lg">{icon}</span>
        {label}
      </span>
      {right ? (
        <span className="rounded-lg bg-neutral-100 px-2 py-1 text-xs font-black text-neutral-700 shadow-sm">
          {right}
        </span>
      ) : null}
    </button>
  );
}
