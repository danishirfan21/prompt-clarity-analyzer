import { ReactNode } from 'react';
import { Menu, Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ShellLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-6 space-y-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Terminal className="w-5 h-5" />
          Prompt Clarity
        </h2>
        <nav className="space-y-4">
          <Link href="/">
            <span className="block hover:text-gray-300">Analyzer</span>
          </Link>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 bg-gray-50 min-h-screen">
        {/* Navbar */}
        <header className="flex justify-between items-center px-6 py-4 border-b bg-white shadow-sm">
          <h1 className="text-lg font-medium text-gray-700">Dashboard</h1>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
