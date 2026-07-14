"use client";

import { useEffect, useState, use, useCallback } from "react";
import { useRouter } from "next/navigation";

export default function LearnerCompetitionDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const [competition, setCompetition] = useState<any>(null);
  const [enrollmentStatus, setEnrollmentStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDetails = useCallback(async () => {
    try {
      const [compRes, enrollRes] = await Promise.all([
        fetch(`/api/competitions/${id}`),
        fetch(`/api/competitions/${id}/enrollment`),
      ]);

      if (!compRes.ok) throw new Error("Failed to load competition");

      const compData = await compRes.json();
      setCompetition(compData);

      if (enrollRes.ok) {
        const enrollData = await enrollRes.json();
        setEnrollmentStatus(enrollData.status);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  const handleEnroll = async () => {
    setEnrolling(true);
    setError(null);
    try {
      const res = await fetch(`/api/competitions/${id}/register`, {
        method: "POST",
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Enrollment failed");

      if (data.status === "ENROLLED") {
        setEnrollmentStatus("ENROLLED");
        // refresh comp to get updated participant count
        fetchDetails();
      } else if (data.status === "PAYMENT_PENDING") {
        setEnrollmentStatus("PAYMENT_PENDING");
        // In a real flow, redirect to Razorpay or payment page
        alert(`Redirecting to payment for Order: ${data.orderId}`);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) return <div style={{ padding: "40px" }}>Loading competition...</div>;
  if (error || !competition)
    return <div style={{ padding: "40px", color: "red" }}>Error: {error || "Not found"}</div>;

  const isFree = competition.economics?.entryFee === 0;
  const isFull =
    competition.eligibility?.maxParticipants &&
    competition.participantCount >= competition.eligibility.maxParticipants;

  return (
    <div style={{ maxWidth: "800px", margin: "40px auto", fontFamily: "sans-serif" }}>
      <header
        style={{ borderBottom: "2px solid #eee", paddingBottom: "20px", marginBottom: "20px" }}
      >
        <h1 style={{ fontSize: "2rem", margin: "0 0 10px 0" }}>{competition.title}</h1>
        <div style={{ display: "flex", gap: "15px", color: "#666" }}>
          <span>
            Status: <strong>{competition.lifecycleState}</strong>
          </span>
          <span>
            Participants: {competition.participantCount}{" "}
            {competition.eligibility?.maxParticipants
              ? `/ ${competition.eligibility.maxParticipants}`
              : ""}
          </span>
          <span>
            Fee:{" "}
            <strong>
              {isFree
                ? "Free"
                : `${competition.economics?.currency || "INR"} ${competition.economics?.entryFee}`}
            </strong>
          </span>
        </div>
      </header>

      <section style={{ marginBottom: "30px" }}>
        <h3>Description</h3>
        <p>{competition.description || "No description provided."}</p>
      </section>

      <section style={{ marginBottom: "30px" }}>
        <h3>Sections Overview</h3>
        {competition.sections?.length > 0 ? (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {competition.sections.map((sec: any) => (
              <li
                key={sec.id}
                style={{
                  padding: "10px",
                  border: "1px solid #ddd",
                  marginBottom: "10px",
                  borderRadius: "4px",
                }}
              >
                <strong>{sec.title}</strong> - {sec.totalQuestions} questions ({sec.totalMarks}{" "}
                marks)
              </li>
            ))}
          </ul>
        ) : (
          <p>No sections configured yet.</p>
        )}
      </section>

      <div
        style={{ padding: "20px", background: "#f8fafc", borderRadius: "8px", textAlign: "center" }}
      >
        {enrollmentStatus === "ENROLLED" ? (
          <div>
            <h3 style={{ color: "green" }}>You are enrolled!</h3>
            <button
              disabled={competition.lifecycleState !== "LIVE"}
              style={{
                background: competition.lifecycleState === "LIVE" ? "#10b981" : "#ccc",
                color: "#fff",
                padding: "12px 24px",
                border: "none",
                borderRadius: "4px",
                fontSize: "16px",
                cursor: competition.lifecycleState === "LIVE" ? "pointer" : "not-allowed",
              }}
            >
              Enter Arena
            </button>
            {competition.lifecycleState !== "LIVE" && (
              <p style={{ fontSize: "12px", color: "#666", marginTop: "8px" }}>
                Competition is not LIVE yet.
              </p>
            )}
          </div>
        ) : enrollmentStatus === "PAYMENT_PENDING" ? (
          <div>
            <h3 style={{ color: "#f59e0b" }}>Payment Pending</h3>
            <button
              style={{
                background: "#f59e0b",
                color: "#fff",
                padding: "12px 24px",
                border: "none",
                borderRadius: "4px",
                fontSize: "16px",
                cursor: "pointer",
              }}
            >
              Complete Payment
            </button>
          </div>
        ) : (
          <div>
            {isFull ? (
              <h3 style={{ color: "red" }}>Capacity Full</h3>
            ) : (
              <button
                onClick={handleEnroll}
                disabled={enrolling || competition.lifecycleState === "ARCHIVED"}
                style={{
                  background: "#3b82f6",
                  color: "#fff",
                  padding: "12px 24px",
                  border: "none",
                  borderRadius: "4px",
                  fontSize: "16px",
                  cursor:
                    enrolling || competition.lifecycleState === "ARCHIVED"
                      ? "not-allowed"
                      : "pointer",
                }}
              >
                {enrolling
                  ? "Processing..."
                  : isFree
                    ? "Enroll for Free"
                    : `Enroll for ${competition.economics?.currency} ${competition.economics?.entryFee}`}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
