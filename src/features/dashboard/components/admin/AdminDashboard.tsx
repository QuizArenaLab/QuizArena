import { 
  Users, ClipboardList, Shield, 
  CheckCircle, ArrowRight, Activity, Trophy, 
  Target, BarChart3, Database, Globe, 
  Bell, Key, HardDrive, AlertCircle, Clock
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { DashboardPoller } from "./DashboardPoller";
import { getPlatformOverview } from "../../../admin/services/get-platform-overview";
import { getOperationalQueue } from "../../../admin/services/get-operational-queue";
import { getLiveActivity } from "../../../admin/services/get-live-activity";
import { getCompetitionIntelligence } from "../../../admin/services/get-competition-intelligence";
import { getUserIntelligence } from "../../../admin/services/get-user-intelligence";
import { getPlatformHealth } from "../../../admin/services/get-platform-health";

const IconMap: Record<string, any> = {
  Database, Globe, Bell, Key, HardDrive, 
  Users, Trophy, CheckCircle, Shield, 
  Target, AlertCircle, Activity
};

export async function AdminDashboardView() {
  const today = format(new Date(), "MMM dd, yyyy");

  const [
    overview,
    { attentionRequires, queueItems },
    liveActivity,
    compIntel,
    userIntel,
    platformHealth
  ] = await Promise.all([
    getPlatformOverview(),
    getOperationalQueue(),
    getLiveActivity(),
    getCompetitionIntelligence(),
    getUserIntelligence(),
    getPlatformHealth()
  ]);

  return (
    <>
      <DashboardPoller />
      <div className="flex flex-col lg:flex-row gap-6 max-w-[1600px] mx-auto items-start">
        {/* Main Column */}
        <div className="flex-1 space-y-8 min-w-0">
          
          {/* PAGE HEADER */}
          <div className="flex items-center justify-between h-[72px] bg-white rounded-xl border border-gray-100 px-6 shrink-0 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-navy rounded-lg">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-navy leading-tight">Admin Dashboard</h1>
                <p className="text-xs text-gray-500 font-medium">Platform Operations & Competition Management</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-navy">{today}</p>
                <p className="text-xs text-gray-500">System Time</p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-lg">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                </span>
                <span className="text-sm font-semibold text-green-700">Platform Healthy</span>
              </div>
            </div>
          </div>

          {/* SECTION 1: OPERATIONS COMMAND CENTER */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
              <p className="text-sm font-semibold text-gray-500 mb-1">Total Users</p>
              <p className="text-3xl font-bold text-navy mb-1 group-hover:text-blue-600 transition-colors">{overview.totalUsers.toLocaleString()}</p>
              <div className="w-full h-1 bg-blue-100 rounded-full mt-3 overflow-hidden">
                <div className="h-full bg-blue-500 w-full"></div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
              <p className="text-sm font-semibold text-gray-500 mb-1">Active Competitions</p>
              <p className="text-3xl font-bold text-navy mb-1 group-hover:text-green-600 transition-colors">{overview.activeCompetitions.toLocaleString()}</p>
              <div className="w-full h-1 bg-green-100 rounded-full mt-3 overflow-hidden">
                <div className="h-full bg-green-500 w-full"></div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
              <p className="text-sm font-semibold text-gray-500 mb-1">Pending Reports</p>
              <p className="text-3xl font-bold text-navy mb-1 group-hover:text-orange-600 transition-colors">{overview.pendingReports.toLocaleString()}</p>
              <div className="w-full h-1 bg-orange-100 rounded-full mt-3 overflow-hidden">
                <div className="h-full bg-orange-500 w-full"></div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
              <p className="text-sm font-semibold text-gray-500 mb-1">Critical Alerts</p>
              <p className="text-3xl font-bold text-navy mb-1 group-hover:text-red-600 transition-colors">{overview.criticalAlerts.toLocaleString()}</p>
              <div className="w-full h-1 bg-red-100 rounded-full mt-3 overflow-hidden">
                <div className="h-full bg-red-500 w-full"></div>
              </div>
            </div>
          </div>

          {/* SECTION 2: REQUIRES ATTENTION */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl border-l-4 border-y border-r border-red-500 border-y-gray-100 border-r-gray-100 p-4 shadow-sm flex flex-col justify-between h-32 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-bold text-navy">Pending Reports</p>
                  <p className="text-2xl font-bold mt-1">{attentionRequires.pendingReports}</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-1 bg-red-100 text-red-700 rounded uppercase tracking-wider">High Priority</span>
              </div>
              <Link href="/dashboard/admin/moderation" className="text-sm font-semibold text-red-600 flex items-center gap-1 hover:gap-2 transition-all">
                Review <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="bg-white rounded-xl border-l-4 border-y border-r border-orange-500 border-y-gray-100 border-r-gray-100 p-4 shadow-sm flex flex-col justify-between h-32 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-bold text-navy">Competition Approval</p>
                  <p className="text-2xl font-bold mt-1">{attentionRequires.pendingApprovals}</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-1 bg-orange-100 text-orange-700 rounded uppercase tracking-wider">Medium</span>
              </div>
              <Link href="/dashboard/admin/challenges" className="text-sm font-semibold text-orange-600 flex items-center gap-1 hover:gap-2 transition-all">
                Approve <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="bg-white rounded-xl border-l-4 border-y border-r border-amber-500 border-y-gray-100 border-r-gray-100 p-4 shadow-sm flex flex-col justify-between h-32 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-bold text-navy">User Appeals</p>
                  <p className="text-2xl font-bold mt-1">{attentionRequires.userAppeals}</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-1 bg-amber-100 text-amber-700 rounded uppercase tracking-wider">Medium</span>
              </div>
              <Link href="/dashboard/admin/users" className="text-sm font-semibold text-amber-600 flex items-center gap-1 hover:gap-2 transition-all">
                Review <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            {attentionRequires.contentReview === 0 ? (
              <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 flex flex-col justify-between h-32">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-bold text-gray-500">Content Review</p>
                    <p className="text-2xl font-bold mt-1 text-gray-400">0</p>
                  </div>
                </div>
                <p className="text-sm font-medium text-gray-400">No pending items</p>
              </div>
            ) : (
              <div className="bg-white rounded-xl border-l-4 border-y border-r border-blue-500 border-y-gray-100 border-r-gray-100 p-4 shadow-sm flex flex-col justify-between h-32 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-bold text-navy">Content Review</p>
                    <p className="text-2xl font-bold mt-1">{attentionRequires.contentReview}</p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-1 bg-blue-100 text-blue-700 rounded uppercase tracking-wider">Low</span>
                </div>
                <Link href="/dashboard/admin/question-bank/review" className="text-sm font-semibold text-blue-600 flex items-center gap-1 hover:gap-2 transition-all">
                  Review <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>

          {/* SECTION 3: OPERATIONAL QUEUE */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-base font-bold text-navy flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-gray-400" /> Live Operational Queue
              </h2>
              <div className="flex gap-2">
                <select className="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-white text-gray-600 outline-none">
                  <option>All Priorities</option>
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
                <select className="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-white text-gray-600 outline-none">
                  <option>All Status</option>
                  <option>Pending</option>
                  <option>In Progress</option>
                </select>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600 whitespace-nowrap">
                <thead className="bg-gray-50 text-xs uppercase font-semibold text-gray-500 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-3">Type</th>
                    <th className="px-6 py-3">Title</th>
                    <th className="px-6 py-3">Priority</th>
                    <th className="px-6 py-3">Created</th>
                    <th className="px-6 py-3">Assigned To</th>
                    <th className="px-6 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {queueItems.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-3 font-medium text-navy">{item.type}</td>
                      <td className="px-6 py-3">{item.title}</td>
                      <td className="px-6 py-3">
                        <span className={`px-2 py-1 text-[10px] font-bold rounded uppercase tracking-wider
                          ${item.priority === 'High' ? 'bg-red-100 text-red-700' : 
                            item.priority === 'Medium' ? 'bg-orange-100 text-orange-700' : 
                            'bg-gray-100 text-gray-700'}`}>
                          {item.priority}
                        </span>
                      </td>
                      <td className="px-6 py-3 flex items-center gap-1.5"><Clock className="w-3 h-3 text-gray-400"/> {format(new Date(item.createdAt), 'MMM dd, HH:mm')}</td>
                      <td className="px-6 py-3 text-gray-500">{item.assignedTo}</td>
                      <td className="px-6 py-3 text-right">
                        <button className="text-primary font-semibold text-xs hover:underline opacity-0 group-hover:opacity-100 transition-opacity">
                          {item.action}
                        </button>
                      </td>
                    </tr>
                  ))}
                  {queueItems.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                        Platform operating normally. No items in queue.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-3 border-t border-gray-100 flex justify-center bg-gray-50/50">
              <button className="text-xs font-semibold text-gray-500 hover:text-navy transition-colors">View All Items</button>
            </div>
          </div>

          {/* SECTION 4 & 5: INTELLIGENCE */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* COMPETITION INTELLIGENCE */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-sm font-bold text-navy mb-4 flex items-center gap-2 uppercase tracking-wider">
                <Trophy className="w-4 h-4 text-gray-400" /> Competition Intelligence
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="text-xs text-gray-500 font-semibold mb-1">Total</p>
                  <p className="text-xl font-bold text-navy">{compIntel.totalCompetitions}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="text-xs text-gray-500 font-semibold mb-1">Active Today</p>
                  <p className="text-xl font-bold text-navy">{compIntel.activeToday}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="text-xs text-gray-500 font-semibold mb-1">Participants</p>
                  <p className="text-xl font-bold text-navy">{compIntel.participantsToday}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="text-xs text-gray-500 font-semibold mb-1">Upcoming</p>
                  <p className="text-xl font-bold text-navy">{compIntel.upcomingEvents}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="text-xs text-gray-500 font-semibold mb-1">Conversion</p>
                  <p className="text-xl font-bold text-green-600">{compIntel.conversionRate}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="text-xs text-gray-500 font-semibold mb-1">Pass Sales</p>
                  <p className="text-xl font-bold text-navy">{compIntel.passSales}</p>
                </div>
              </div>
            </div>

            {/* USER INTELLIGENCE */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-sm font-bold text-navy mb-4 flex items-center gap-2 uppercase tracking-wider">
                <Users className="w-4 h-4 text-gray-400" /> User Intelligence
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="text-xs text-gray-500 font-semibold mb-1">New Today</p>
                  <p className="text-xl font-bold text-navy">{userIntel.newToday}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="text-xs text-gray-500 font-semibold mb-1">Active Today</p>
                  <p className="text-xl font-bold text-navy">{userIntel.activeToday}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="text-xs text-gray-500 font-semibold mb-1">Returning</p>
                  <p className="text-xl font-bold text-navy">{userIntel.returningUsers}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="text-xs text-gray-500 font-semibold mb-1">Suspended</p>
                  <p className="text-xl font-bold text-red-500">{userIntel.suspended}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="text-xs text-gray-500 font-semibold mb-1">Growth</p>
                  <p className="text-xl font-bold text-green-600">{userIntel.growth}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <p className="text-xs text-gray-500 font-semibold mb-1">Avg Session</p>
                  <p className="text-xl font-bold text-navy">{userIntel.avgSessionTime}</p>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 7: PLATFORM HEALTH */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-sm font-bold text-navy mb-4 flex items-center gap-2 uppercase tracking-wider">
              <Activity className="w-4 h-4 text-gray-400" /> Platform Health
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {platformHealth.map((health, idx) => {
                const Icon = IconMap[health.iconName] || Activity;
                const statusColor = health.status === "Healthy" ? "text-green-600" : (health.status === "Warning" ? "text-amber-600" : "text-red-600");
                const statusBg = health.status === "Healthy" ? "bg-green-100" : (health.status === "Warning" ? "bg-amber-100" : "bg-red-100");
                const dotBg = health.status === "Healthy" ? "bg-green-500" : (health.status === "Warning" ? "bg-amber-500" : "bg-red-500");
                return (
                  <div key={idx} className="p-3 bg-gray-50 rounded-lg border border-gray-100 flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${statusBg}`}>
                      <Icon className={`w-4 h-4 ${statusColor}`} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-navy">{health.name}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${dotBg}`}></span>
                        <span className="text-[10px] font-semibold text-gray-500 uppercase">{health.status}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

        </div>

        {/* Right Column: SECTION 6: LIVE PLATFORM ACTIVITY */}
        <div className="w-full lg:w-[320px] shrink-0 lg:sticky lg:top-[90px]">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col max-h-[85vh]">
            <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between sticky top-0 z-10">
              <h2 className="text-sm font-bold text-navy uppercase tracking-wider flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary" /> Live Activity
              </h2>
              <div className="flex gap-1 items-center">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-[10px] text-gray-500 font-semibold uppercase">Live</span>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-gray-200">
              <div className="space-y-1">
                {liveActivity.map((activity) => {
                  const Icon = IconMap[activity.iconName] || Activity;
                  return (
                    <div key={activity.id} className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-default">
                      <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${activity.bg}`}>
                        <Icon className={`w-3.5 h-3.5 ${activity.color}`} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-navy leading-tight">{activity.message}</p>
                        <p className="text-xs text-gray-400 mt-1">{format(new Date(activity.createdAt), 'HH:mm:ss a')}</p>
                      </div>
                    </div>
                  )
                })}
                {liveActivity.length === 0 && (
                  <div className="p-4 text-center text-sm text-gray-500">
                    No recent activity.
                  </div>
                )}
              </div>
            </div>
            <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/50 text-center">
              <Link href="/dashboard/admin/monitoring" className="text-xs font-semibold text-primary hover:underline">
                View Full Audit Log
              </Link>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
