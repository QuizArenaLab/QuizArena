"use client";

import { useEffect, useState, use, useCallback } from "react";
import { useRouter } from "next/navigation";

export default function Arena({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  // Quiz state
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch(`/api/competitions/${id}/session/current`);
        if (!res.ok) {
          throw new Error("Failed to load session. Did you enter the arena?");
        }
        const data = await res.json();
        setSession(data);

        if (data.status === "SUBMITTED") {
          router.push(`/competitions/${id}`);
          return;
        }

        // Flatten questions from sections
        const allQuestions: any[] = [];
        data.competition?.sections?.forEach((sec: any) => {
          sec.questions?.forEach((q: any) => {
            allQuestions.push(q);
          });
        });
        setQuestions(allQuestions);

        // Pre-fill existing answers
        const initialAnswers: Record<string, string> = {};
        data.answers?.forEach((ans: any) => {
          if (ans.selectedOptionId) {
            initialAnswers[ans.questionId] = ans.selectedOptionId;
          }
        });
        setAnswers(initialAnswers);

        // Initialize Timer
        if (data.expiresAt) {
          const remaining = Math.max(
            0,
            Math.floor((new Date(data.expiresAt).getTime() - Date.now()) / 1000)
          );
          setTimeLeft(remaining);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [id, router]);

  const handleSubmit = useCallback(async () => {
    setSubmitting(true);
    try {
      const res = await fetch(`/api/competitions/${id}/session/submit`, {
        method: "POST",
      });
      if (res.ok) {
        router.push(`/competitions/${id}`);
      } else {
        alert("Submission failed");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }, [id, router]);

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev && prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev ? prev - 1 : 0;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, handleSubmit]);

  const handleOptionSelect = async (questionId: string, optionId: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));

    // Save to server
    try {
      await fetch(`/api/competitions/${id}/session/answers/${questionId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ selectedOptionId: optionId }),
      });
    } catch (err) {
      console.error("Failed to save answer", err);
    }
  };

  if (loading)
    return <div style={{ padding: "40px", textAlign: "center" }}>Initializing Arena...</div>;
  if (error || !session)
    return <div style={{ padding: "40px", color: "red", textAlign: "center" }}>{error}</div>;

  const currentQuestion = questions[currentIndex];

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div
      style={{ display: "flex", height: "100vh", fontFamily: "sans-serif", background: "#f8fafc" }}
    >
      {/* Sidebar: Navigation */}
      <div
        style={{
          width: "300px",
          borderRight: "1px solid #ddd",
          background: "#fff",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h2 style={{ fontSize: "1.2rem", margin: "0 0 20px 0" }}>Questions</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: "10px",
            flex: 1,
            alignContent: "start",
          }}
        >
          {questions.map((q, idx) => (
            <button
              key={q.questionId}
              onClick={() => setCurrentIndex(idx)}
              style={{
                padding: "10px",
                borderRadius: "4px",
                border: currentIndex === idx ? "2px solid #3b82f6" : "1px solid #ddd",
                background: answers[q.questionId] ? "#d1fae5" : "#fff",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              {idx + 1}
            </button>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          disabled={submitting}
          style={{
            marginTop: "auto",
            padding: "15px",
            background: "#ef4444",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: submitting ? "not-allowed" : "pointer",
          }}
        >
          {submitting ? "Submitting..." : "Submit Exam"}
        </button>
      </div>

      {/* Main Area: Question & Timer */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "40px" }}>
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "30px",
            paddingBottom: "20px",
            borderBottom: "2px solid #ddd",
          }}
        >
          <h1 style={{ margin: 0, fontSize: "1.5rem" }}>Arena</h1>
          <div
            style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              color: timeLeft && timeLeft < 300 ? "#ef4444" : "#333",
              background: "#fff",
              padding: "10px 20px",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
            }}
          >
            ⏳ {timeLeft !== null ? formatTime(timeLeft) : "--:--"}
          </div>
        </header>

        {currentQuestion ? (
          <div
            style={{
              background: "#fff",
              padding: "30px",
              borderRadius: "8px",
              boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
              flex: 1,
            }}
          >
            <h2 style={{ fontSize: "1.3rem", marginBottom: "20px", lineHeight: "1.6" }}>
              <span style={{ color: "#666", marginRight: "10px" }}>Q{currentIndex + 1}.</span>
              {currentQuestion.question?.text || "Unknown question text"}
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              {/* Note: Options should technically come from question.options Json payload, assuming a format here */}
              {(currentQuestion.question?.options || []).map((opt: any) => (
                <label
                  key={opt.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "15px",
                    padding: "15px",
                    border:
                      answers[currentQuestion.questionId] === opt.id
                        ? "2px solid #3b82f6"
                        : "1px solid #e2e8f0",
                    background: answers[currentQuestion.questionId] === opt.id ? "#eff6ff" : "#fff",
                    borderRadius: "6px",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  <input
                    type="radio"
                    name={`q-${currentQuestion.questionId}`}
                    checked={answers[currentQuestion.questionId] === opt.id}
                    onChange={() => handleOptionSelect(currentQuestion.questionId, opt.id)}
                    style={{ width: "20px", height: "20px" }}
                  />
                  <span style={{ fontSize: "1.1rem" }}>{opt.text}</span>
                </label>
              ))}
            </div>
          </div>
        ) : (
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#666",
            }}
          >
            No questions available for this session.
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "30px" }}>
          <button
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex((c) => c - 1)}
            style={{
              padding: "12px 24px",
              fontSize: "16px",
              borderRadius: "6px",
              border: "1px solid #ddd",
              background: "#fff",
              cursor: currentIndex === 0 ? "not-allowed" : "pointer",
            }}
          >
            ← Previous
          </button>

          <button
            disabled={currentIndex === questions.length - 1}
            onClick={() => setCurrentIndex((c) => c + 1)}
            style={{
              padding: "12px 24px",
              fontSize: "16px",
              borderRadius: "6px",
              border: "none",
              background: "#3b82f6",
              color: "#fff",
              cursor: currentIndex === questions.length - 1 ? "not-allowed" : "pointer",
            }}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
