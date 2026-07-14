"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function Leaderboard({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data: session } = useSession();

  const [leaderboard, setLeaderboard] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentUserId = session?.user?.id;

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch(`/api/competitions/${id}/leaderboard`);
        if (!res.ok) throw new Error("Failed to load leaderboard");
        const data = await res.json();
        setLeaderboard(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [id]);

  if (loading)
    return <div style={{ padding: "40px", textAlign: "center" }}>Loading Leaderboard...</div>;
  if (error || !leaderboard)
    return <div style={{ padding: "40px", color: "red", textAlign: "center" }}>{error}</div>;

  const { projection, snapshots } = leaderboard;

  return (
    <div style={{ maxWidth: "1000px", margin: "40px auto", fontFamily: "sans-serif" }}>
      <header style={{ marginBottom: "40px", textAlign: "center" }}>
        <h1 style={{ fontSize: "2.5rem", margin: "0 0 10px 0", color: "#1e293b" }}>
          Global Leaderboard
        </h1>
        <p style={{ color: "#64748b", fontSize: "1.1rem" }}>
          See how you stack up against the competition.
        </p>

        <div style={{ display: "flex", justifyContent: "center", gap: "20px", marginTop: "30px" }}>
          <div
            style={{
              background: "#f8fafc",
              padding: "20px",
              borderRadius: "12px",
              minWidth: "150px",
              border: "1px solid #e2e8f0",
            }}
          >
            <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#3b82f6" }}>
              {projection.participantCount}
            </div>
            <div
              style={{
                color: "#64748b",
                fontSize: "0.9rem",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginTop: "5px",
              }}
            >
              Participants
            </div>
          </div>
          <div
            style={{
              background: "#f8fafc",
              padding: "20px",
              borderRadius: "12px",
              minWidth: "150px",
              border: "1px solid #e2e8f0",
            }}
          >
            <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#10b981" }}>
              {projection.highestScore}
            </div>
            <div
              style={{
                color: "#64748b",
                fontSize: "0.9rem",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginTop: "5px",
              }}
            >
              Highest Score
            </div>
          </div>
          <div
            style={{
              background: "#f8fafc",
              padding: "20px",
              borderRadius: "12px",
              minWidth: "150px",
              border: "1px solid #e2e8f0",
            }}
          >
            <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#8b5cf6" }}>
              {Math.round(projection.averageAccuracy * 100)}%
            </div>
            <div
              style={{
                color: "#64748b",
                fontSize: "0.9rem",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginTop: "5px",
              }}
            >
              Avg Accuracy
            </div>
          </div>
        </div>
      </header>

      <div
        style={{
          background: "#fff",
          borderRadius: "12px",
          border: "1px solid #e2e8f0",
          overflow: "hidden",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ background: "#f1f5f9", borderBottom: "2px solid #e2e8f0" }}>
              <th style={{ padding: "20px", color: "#475569", fontWeight: "600" }}>Rank</th>
              <th style={{ padding: "20px", color: "#475569", fontWeight: "600" }}>Player</th>
              <th style={{ padding: "20px", color: "#475569", fontWeight: "600" }}>Score</th>
              <th style={{ padding: "20px", color: "#475569", fontWeight: "600" }}>Accuracy</th>
              <th style={{ padding: "20px", color: "#475569", fontWeight: "600" }}>Time Taken</th>
            </tr>
          </thead>
          <tbody>
            {snapshots.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: "40px", textAlign: "center", color: "#94a3b8" }}>
                  No participants have completed the competition yet.
                </td>
              </tr>
            ) : (
              snapshots.map((snap: any, index: number) => {
                const isCurrentUser = snap.userId === currentUserId;
                const formatTime = (seconds: number) => {
                  const m = Math.floor(seconds / 60);
                  const s = seconds % 60;
                  return `${m}m ${s}s`;
                };

                return (
                  <tr
                    key={snap.id}
                    style={{
                      borderBottom: "1px solid #e2e8f0",
                      background: isCurrentUser ? "#eff6ff" : index % 2 === 0 ? "#fff" : "#fafafa",
                      transition: "background 0.2s",
                    }}
                  >
                    <td style={{ padding: "20px" }}>
                      {snap.rank === 1
                        ? "🥇"
                        : snap.rank === 2
                          ? "🥈"
                          : snap.rank === 3
                            ? "🥉"
                            : `#${snap.rank}`}
                    </td>
                    <td
                      style={{
                        padding: "20px",
                        fontWeight: isCurrentUser ? "bold" : "normal",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <div
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                          background: "#cbd5e1",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#fff",
                          fontWeight: "bold",
                        }}
                      >
                        {snap.user?.name ? snap.user.name.charAt(0).toUpperCase() : "?"}
                      </div>
                      {snap.user?.name || snap.userId}{" "}
                      {isCurrentUser && (
                        <span
                          style={{
                            fontSize: "0.8rem",
                            color: "#3b82f6",
                            background: "#dbeafe",
                            padding: "2px 8px",
                            borderRadius: "12px",
                            marginLeft: "10px",
                          }}
                        >
                          You
                        </span>
                      )}
                    </td>
                    <td style={{ padding: "20px", fontWeight: "bold", color: "#0f172a" }}>
                      {snap.score}
                    </td>
                    <td style={{ padding: "20px", color: "#64748b" }}>
                      {Math.round(snap.accuracy * 100)}%
                    </td>
                    <td style={{ padding: "20px", color: "#64748b" }}>
                      {formatTime(snap.completionTime)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: "40px", textAlign: "center" }}>
        <button
          onClick={() => router.push(`/competitions/${id}`)}
          style={{
            padding: "12px 24px",
            background: "#e2e8f0",
            color: "#475569",
            border: "none",
            borderRadius: "6px",
            fontSize: "16px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          ← Back to Competition
        </button>
      </div>
    </div>
  );
}
