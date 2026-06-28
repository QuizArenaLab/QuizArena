import { UserRewardsReadModel } from "@/features/competitions/rewards/read-model/RewardReadModel";
import { Download, ExternalLink } from "lucide-react";
import Link from "next/link";

export function CertificatesRegion({ data }: { data: UserRewardsReadModel }) {
  if (data.certificates.length === 0) return null;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Your Certificates</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.certificates.map(cert => (
          <div key={cert.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden group">
            <div className="h-40 bg-linear-to-br from-slate-800 to-slate-900 border-b border-slate-800 flex items-center justify-center p-6 relative">
              <div className="text-center z-10">
                <div className="text-xs font-bold tracking-widest text-slate-500 mb-2">CERTIFICATE</div>
                <div className="text-xl font-serif text-white mb-1">{cert.competitionName}</div>
                <div className="text-yellow-500 text-sm font-medium">{cert.type.replace(/_/g, " ")}</div>
              </div>
              {cert.type === "WINNER" && (
                <div className="absolute top-0 right-0 w-16 h-16 bg-yellow-500/10 rounded-bl-full" />
              )}
            </div>
            <div className="p-4 flex items-center justify-between">
              <div className="text-xs text-slate-400">
                Issued: {new Date(cert.issueDate).toLocaleDateString()}
              </div>
              <div className="flex gap-2">
                <Link href={cert.verificationUrl} target="_blank" className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-md transition-colors" title="Verify">
                  <ExternalLink className="w-4 h-4" />
                </Link>
                {cert.pdfUrl ? (
                  <Link href={cert.pdfUrl} target="_blank" className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-md transition-colors" title="Download PDF">
                    <Download className="w-4 h-4" />
                  </Link>
                ) : (
                  <button disabled className="p-2 bg-slate-800 text-slate-500 rounded-md cursor-not-allowed" title="PDF Processing...">
                    <Download className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
