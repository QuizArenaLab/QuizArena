import { CheckCircle2, ShieldCheck, Database, Zap } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-slate-50 text-slate-900">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-linear-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          QuizArena Infrastructure &nbsp;
          <code className="font-bold text-green-600">v1.0.0-foundation</code>
        </p>
      </div>

      <div className="mt-16 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-4">
          Foundation Ready
        </h1>
        <p className="text-xl text-slate-600 mb-12">
          The core infrastructure for QuizArena has been successfully established.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl">
          <StatusCard 
            icon={<Zap className="w-6 h-6 text-yellow-500" />}
            title="Next.js"
            status="Active"
            description="App Router & TypeScript"
          />
          <StatusCard 
            icon={<ShieldCheck className="w-6 h-6 text-blue-500" />}
            title="Auth.js"
            status="Configured"
            description="Foundation installed"
          />
          <StatusCard 
            icon={<Database className="w-6 h-6 text-purple-500" />}
            title="Prisma & DB"
            status="Ready"
            description="Supabase connection setup"
          />
          <StatusCard 
            icon={<CheckCircle2 className="w-6 h-6 text-green-500" />}
            title="Tailwind"
            status="Live"
            description="Modern styling system"
          />
        </div>
      </div>

      <div className="mt-20 p-6 bg-white rounded-2xl shadow-sm border border-slate-200 max-w-2xl w-full">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Health Check
        </h2>
        <ul className="space-y-3 text-sm text-slate-600">
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            TypeScript & ESLint Configured
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            Scalable Folder Structure Created
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            Prisma Singleton & Supabase Client Ready
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            Zustand & Utility functions installed
          </li>
        </ul>
      </div>
    </main>
  );
}

function StatusCard({ icon, title, status, description }: { icon: React.ReactNode, title: string, status: string, description: string }) {
  return (
    <div className="flex flex-col p-6 bg-white rounded-xl shadow-sm border border-slate-200 hover:border-slate-300 transition-colors">
      <div className="mb-4">{icon}</div>
      <h3 className="font-bold text-slate-900">{title}</h3>
      <div className="text-xs font-medium text-green-600 mb-2 uppercase tracking-wider">{status}</div>
      <p className="text-sm text-slate-500">{description}</p>
    </div>
  );
}
