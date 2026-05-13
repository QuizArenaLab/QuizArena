import { auth, signOut } from "@/auth/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="overflow-hidden rounded-xl bg-white shadow border border-gray-100">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center border-b border-gray-200">
            <div>
              <h3 className="text-lg font-medium leading-6 text-gray-900">Dashboard</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">Secure user session data.</p>
            </div>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
              >
                Sign out
              </button>
            </form>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center space-x-5">
              <div className="shrink-0">
                {session.user.image ? (
                  <img className="h-16 w-16 rounded-full" src={session.user.image} alt="User Avatar" />
                ) : (
                  <span className="inline-block h-16 w-16 overflow-hidden rounded-full bg-gray-100">
                    <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </span>
                )}
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-900">{session.user.name}</h4>
                <p className="text-sm font-medium text-gray-500">{session.user.email}</p>
              </div>
            </div>
            
            <div className="mt-8 border-t border-gray-200 pt-5">
              <h4 className="text-md font-semibold text-gray-900 mb-4">Session Data</h4>
              <div className="rounded-md bg-gray-50 p-4 border border-gray-200 overflow-auto">
                <pre className="text-xs text-gray-700 whitespace-pre-wrap break-all">
                  {JSON.stringify(session, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
