import { verifyCertificateAction } from "@/features/competitions/rewards/actions/rewards.actions";
import { CheckCircle, XCircle } from "lucide-react";

export default async function CertificateVerificationPage({ params }: { params: { token: string } }) {
  const result = await verifyCertificateAction(params.token);

  if (!result.success || !result.data) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <XCircle className="w-20 h-20 text-red-500 mb-6" />
        <h1 className="text-3xl font-bold text-white mb-4">Invalid Certificate</h1>
        <p className="text-slate-400 max-w-md">
          This verification token could not be found or has been revoked. Ensure the URL is exactly as printed on the certificate.
        </p>
      </div>
    );
  }

  const cert = result.data.certificate;

  return (
    <div className="min-h-screen bg-slate-950 p-6 flex flex-col items-center py-20 font-sans">
      <div className="max-w-2xl w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-green-500 to-emerald-400" />
        
        <div className="text-center mb-10">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-white mb-2">Verified Certificate</h1>
          <p className="text-emerald-400 text-sm font-semibold tracking-wide uppercase">
            Official Document • Authenticated
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex justify-between border-b border-slate-800 pb-4">
            <span className="text-slate-400">Issued To</span>
            <span className="text-white font-bold">{cert.participantName}</span>
          </div>
          <div className="flex justify-between border-b border-slate-800 pb-4">
            <span className="text-slate-400">Competition</span>
            <span className="text-white font-bold">{cert.competitionName}</span>
          </div>
          <div className="flex justify-between border-b border-slate-800 pb-4">
            <span className="text-slate-400">Award Type</span>
            <span className="text-yellow-500 font-bold">{cert.certificateType}</span>
          </div>
          <div className="flex justify-between border-b border-slate-800 pb-4">
            <span className="text-slate-400">Issuer</span>
            <span className="text-white font-bold">{cert.issuer}</span>
          </div>
          <div className="flex justify-between pb-4">
            <span className="text-slate-400">Issue Date</span>
            <span className="text-white">{cert.issueDate.toLocaleDateString()}</span>
          </div>
        </div>

        <div className="mt-12 bg-slate-950 p-6 rounded-xl text-center border border-slate-800">
          <p className="text-xs text-slate-500 mb-2">VERIFICATION TOKEN</p>
          <code className="text-sm font-mono text-slate-300 break-all">{params.token}</code>
          <p className="text-xs text-slate-500 mt-4">Verified securely by QuizArena at {result.data.verifiedAt.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}
