import Header from "@/_components/header";
import { Sidebar } from "@/_components/sidebar";


export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full w-full bg-neutral-100 text-neutral-900">
      <input id="nav" type="checkbox" className="peer sr-only lg:hidden" />

      <label
        htmlFor="nav"
        className="fixed inset-0 z-30 hidden bg-black/20 peer-checked:block lg:hidden"
        aria-label="Close sidebar"
      />

      <aside
        className="fixed left-0 top-0 z-40 h-screen w-72 border-r border-neutral-200 bg-white
        -translate-x-full peer-checked:translate-x-0 transition-transform duration-200 lg:hidden"
      >
        <Sidebar userInitials="J" username="thejayadad" subtitle="Bookmarks" />
      </aside>

      <div className="flex h-full">
        <aside className="hidden h-full w-72 border-r border-neutral-200 bg-white lg:block">
          <Sidebar userInitials="J" username="thejayadad" subtitle="Bookmarks" />
        </aside>
        <div className="w-full">
          <Header />
        <main className="flex-1  h-full overflow-hidden">{children}</main>
        </div>
      </div>
    </div>
  );
}
