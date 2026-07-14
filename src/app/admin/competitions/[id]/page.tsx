"use client";

import { useEffect, useState, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import { CompetitionDTO } from "@/features/competitions/types/dto";
import type {
  CompetitionConfigDTO,
  CompetitionEconomicsDTO,
  CompetitionEligibilityDTO,
  CompetitionSectionDTO,
  CompetitionQuestionDTO,
  CompetitionScheduleDTO,
  CompetitionLifecycleAuditDTO,
} from "@/features/competitions/types/dto";

type Tab =
  | "overview"
  | "config"
  | "economics"
  | "eligibility"
  | "sections"
  | "questions"
  | "lifecycle"
  | "schedule"
  | "audit";

export default function CompetitionDetail({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);

  const [competition, setCompetition] = useState<CompetitionDTO | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Sub-entity state
  const [config, setConfig] = useState<CompetitionConfigDTO | null>(null);
  const [economics, setEconomics] = useState<CompetitionEconomicsDTO | null>(null);
  const [eligibility, setEligibility] = useState<CompetitionEligibilityDTO | null>(null);
  const [sections, setSections] = useState<CompetitionSectionDTO[]>([]);
  const [questions, setQuestions] = useState<CompetitionQuestionDTO[]>([]);

  const [lifecycleInfo, setLifecycleInfo] = useState<{
    currentState: string;
    status: string;
    validTransitions: string[];
  } | null>(null);
  const [schedule, setSchedule] = useState<CompetitionScheduleDTO | null>(null);
  const [auditLog, setAuditLog] = useState<CompetitionLifecycleAuditDTO[]>([]);

  // Form state
  const [transitionForm, setTransitionForm] = useState({ targetState: "", reason: "" });
  const [scheduleForm, setScheduleForm] = useState({
    publishAt: "",
    expiresAt: "",
    timezone: "Asia/Kolkata",
  });

  const [configForm, setConfigForm] = useState({
    negativeMarkingEnabled: false,
    negativeMarkPerQuestion: 0,
    passingMarks: 0,
    allowRetake: false,
    randomizeQuestions: false,
    randomizeOptions: false,
  });
  const [economicsForm, setEconomicsForm] = useState({
    entryFee: 0,
    rewardPool: 0,
    currency: "INR",
  });
  const [eligibilityForm, setEligibilityForm] = useState({
    maxParticipants: 0,
  });
  const [sectionForm, setSectionForm] = useState({
    title: "",
    slug: "",
    description: "",
    displayOrder: 0,
  });
  const [questionForm, setQuestionForm] = useState({
    questionId: "",
    sectionId: "",
    marks: 1,
  });

  const fetchCompetition = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/competitions/${id}`);
      if (!res.ok) throw new Error("Failed to fetch competition");
      const data = await res.json();
      setCompetition(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCompetition();
  }, [fetchCompetition]);

  const fetchTabData = useCallback(async (tab: Tab) => {
    if (tab === "overview") return;
    try {
      const res = await fetch(`/api/admin/competitions/${id}/${tab}`);
      if (!res.ok) return;
      const json = await res.json();
      const data = json.data;

      if (tab === "config" && data) {
        setConfig(data);
        setConfigForm({
          negativeMarkingEnabled: data.negativeMarkingEnabled ?? false,
          negativeMarkPerQuestion: data.negativeMarkPerQuestion ?? 0,
          passingMarks: data.passingMarks ?? 0,
          allowRetake: data.allowRetake ?? false,
          randomizeQuestions: data.randomizeQuestions ?? false,
          randomizeOptions: data.randomizeOptions ?? false,
        });
      }
      if (tab === "economics" && data) {
        setEconomics(data);
        setEconomicsForm({
          entryFee: data.entryFee ?? 0,
          rewardPool: data.rewardPool ?? 0,
          currency: data.currency ?? "INR",
        });
      }
      if (tab === "eligibility" && data) {
        setEligibility(data);
        setEligibilityForm({
          maxParticipants: data.maxParticipants ?? 0,
        });
      }
      if (tab === "sections") setSections(Array.isArray(data) ? data : []);
      if (tab === "questions") setQuestions(Array.isArray(data) ? data : []);
      if (tab === "lifecycle" && data) setLifecycleInfo(data);
      if (tab === "schedule" && data) {
        setSchedule(data);
        setScheduleForm({
          publishAt: data.publishAt ? new Date(data.publishAt).toISOString().slice(0, 16) : "",
          expiresAt: data.expiresAt ? new Date(data.expiresAt).toISOString().slice(0, 16) : "",
          timezone: data.timezone || "Asia/Kolkata",
        });
      }
      if (tab === "audit") setAuditLog(Array.isArray(data) ? data : []);
    } catch {
      /* silent */
    }
  }, [id]);

  useEffect(() => {
    fetchTabData(activeTab);
  }, [activeTab, fetchTabData]);

  // ─── Handlers ────────────────────────────────────

  const handlePublish = async () => {
    setError(null);
    try {
      const res = await fetch(`/api/admin/competitions/${id}/publish`, {
        method: "POST",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to publish");
      }
      fetchCompetition();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  };

  const handleSave = async (endpoint: string, body: object) => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/competitions/${id}/${endpoint}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Save failed");
      }
      await fetchTabData(activeTab);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setSaving(false);
    }
  };

  const handleCreateSection = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/competitions/${id}/sections`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sectionForm),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Create section failed");
      }
      setSectionForm({ title: "", slug: "", description: "", displayOrder: 0 });
      await fetchTabData("sections");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setSaving(false);
    }
  };

  const handleAddQuestion = async () => {
    setSaving(true);
    setError(null);
    try {
      const payload: Record<string, unknown> = {
        questionId: questionForm.questionId,
        marks: questionForm.marks,
      };
      if (questionForm.sectionId) payload.sectionId = questionForm.sectionId;

      const res = await fetch(`/api/admin/competitions/${id}/questions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Add question failed");
      }
      setQuestionForm({ questionId: "", sectionId: "", marks: 1 });
      await fetchTabData("questions");
      await fetchTabData("questions");
      fetchCompetition(); // Refresh denormalized counters
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setSaving(false);
    }
  };

  const handleTransition = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/competitions/${id}/lifecycle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetState: transitionForm.targetState,
          reason: transitionForm.reason || undefined,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Transition failed");
      }
      setTransitionForm({ targetState: "", reason: "" });
      fetchCompetition();
      await fetchTabData("lifecycle");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setSaving(false);
    }
  };

  const handleSchedule = async () => {
    setSaving(true);
    setError(null);
    try {
      const payload: Record<string, unknown> = {
        publishAt: new Date(scheduleForm.publishAt).toISOString(),
        timezone: scheduleForm.timezone,
      };
      if (scheduleForm.expiresAt)
        payload.expiresAt = new Date(scheduleForm.expiresAt).toISOString();

      const res = await fetch(`/api/admin/competitions/${id}/schedule`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Schedule failed");
      }
      fetchCompetition();
      await fetchTabData("schedule");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setSaving(false);
    }
  };

  // ─── Styles ──────────────────────────────────────

  const tabStyle = (tab: Tab) => ({
    padding: "8px 16px",
    cursor: "pointer" as const,
    borderBottom: activeTab === tab ? "3px solid #2563eb" : "3px solid transparent",
    fontWeight: activeTab === tab ? ("bold" as const) : ("normal" as const),
    background: "none",
    border: "none",
    borderBottomStyle: "solid" as const,
    borderBottomWidth: "3px",
    borderBottomColor: activeTab === tab ? "#2563eb" : "transparent",
  });

  const inputStyle = {
    padding: "6px 10px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    width: "100%",
    marginBottom: "8px",
  };

  const btnStyle = {
    padding: "8px 16px",
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer" as const,
  };

  if (loading) return <div>Loading...</div>;
  if (!competition) return <div>Not Found</div>;

  return (
    <div style={{ padding: "20px", maxWidth: "900px" }}>
      <button onClick={() => router.push("/admin/competitions")} style={{ marginBottom: "20px" }}>
        ← Back to List
      </button>
      <h1>{competition.title}</h1>
      <p style={{ color: "#666" }}>
        {competition.lifecycleState} · {competition.status} · {competition.durationMinutes} min
      </p>

      {error && (
        <div
          style={{
            padding: "10px",
            background: "#fee2e2",
            color: "#991b1b",
            borderRadius: "4px",
            marginBottom: "12px",
          }}
        >
          {error}
        </div>
      )}

      {/* Tab Bar */}
      <div
        style={{
          display: "flex",
          gap: "4px",
          borderBottom: "1px solid #ddd",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}
      >
        {(
          [
            "overview",
            "config",
            "economics",
            "eligibility",
            "sections",
            "questions",
            "lifecycle",
            "schedule",
            "audit",
          ] as Tab[]
        ).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={tabStyle(tab)}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* ─── Overview Tab ───────────────────────────── */}
      {activeTab === "overview" && (
        <div style={{ padding: "10px", border: "1px solid #ccc", borderRadius: "4px" }}>
          <p>
            <strong>ID:</strong> {competition.id}
          </p>
          <p>
            <strong>Slug:</strong> {competition.slug}
          </p>
          <p>
            <strong>Type:</strong> {competition.competitionType}
          </p>
          <p>
            <strong>Total Questions:</strong> {competition.totalQuestions}
          </p>
          <p>
            <strong>Maximum Marks:</strong> {competition.maximumMarks}
          </p>
          <div style={{ marginTop: "12px" }}>
            {competition.lifecycleState === "DRAFT" && (
              <button onClick={handlePublish} style={{ ...btnStyle, backgroundColor: "green" }}>
                Publish Competition
              </button>
            )}
          </div>
        </div>
      )}

      {/* ─── Config Tab ─────────────────────────────── */}
      {activeTab === "config" && (
        <div>
          <h3>Competition Configuration</h3>
          <label>
            <input
              type="checkbox"
              checked={configForm.negativeMarkingEnabled}
              onChange={(e) =>
                setConfigForm({ ...configForm, negativeMarkingEnabled: e.target.checked })
              }
            />{" "}
            Negative Marking Enabled
          </label>
          <br />
          <label>
            Negative Mark Per Question:{" "}
            <input
              type="number"
              style={inputStyle}
              value={configForm.negativeMarkPerQuestion}
              onChange={(e) =>
                setConfigForm({
                  ...configForm,
                  negativeMarkPerQuestion: parseFloat(e.target.value) || 0,
                })
              }
            />
          </label>
          <label>
            Passing Marks:{" "}
            <input
              type="number"
              style={inputStyle}
              value={configForm.passingMarks}
              onChange={(e) =>
                setConfigForm({ ...configForm, passingMarks: parseInt(e.target.value) || 0 })
              }
            />
          </label>
          <label>
            <input
              type="checkbox"
              checked={configForm.allowRetake}
              onChange={(e) => setConfigForm({ ...configForm, allowRetake: e.target.checked })}
            />{" "}
            Allow Retake
          </label>
          <br />
          <label>
            <input
              type="checkbox"
              checked={configForm.randomizeQuestions}
              onChange={(e) =>
                setConfigForm({ ...configForm, randomizeQuestions: e.target.checked })
              }
            />{" "}
            Randomize Questions
          </label>
          <br />
          <label>
            <input
              type="checkbox"
              checked={configForm.randomizeOptions}
              onChange={(e) => setConfigForm({ ...configForm, randomizeOptions: e.target.checked })}
            />{" "}
            Randomize Options
          </label>
          <br />
          <br />
          <button
            style={btnStyle}
            disabled={saving}
            onClick={() => handleSave("config", configForm)}
          >
            {saving ? "Saving..." : "Save Config"}
          </button>
        </div>
      )}

      {/* ─── Economics Tab ───────────────────────────── */}
      {activeTab === "economics" && (
        <div>
          <h3>Competition Economics</h3>
          <label>
            Entry Fee:{" "}
            <input
              type="number"
              style={inputStyle}
              value={economicsForm.entryFee}
              onChange={(e) =>
                setEconomicsForm({ ...economicsForm, entryFee: parseFloat(e.target.value) || 0 })
              }
            />
          </label>
          <label>
            Reward Pool:{" "}
            <input
              type="number"
              style={inputStyle}
              value={economicsForm.rewardPool}
              onChange={(e) =>
                setEconomicsForm({ ...economicsForm, rewardPool: parseFloat(e.target.value) || 0 })
              }
            />
          </label>
          <label>
            Currency:{" "}
            <input
              type="text"
              style={inputStyle}
              value={economicsForm.currency}
              onChange={(e) => setEconomicsForm({ ...economicsForm, currency: e.target.value })}
            />
          </label>
          <button
            style={btnStyle}
            disabled={saving}
            onClick={() => handleSave("economics", economicsForm)}
          >
            {saving ? "Saving..." : "Save Economics"}
          </button>
        </div>
      )}

      {/* ─── Eligibility Tab ────────────────────────── */}
      {activeTab === "eligibility" && (
        <div>
          <h3>Eligibility Rules</h3>
          <label>
            Max Participants:{" "}
            <input
              type="number"
              style={inputStyle}
              value={eligibilityForm.maxParticipants}
              onChange={(e) =>
                setEligibilityForm({
                  ...eligibilityForm,
                  maxParticipants: parseInt(e.target.value) || 0,
                })
              }
            />
          </label>
          <button
            style={btnStyle}
            disabled={saving}
            onClick={() =>
              handleSave("eligibility", {
                maxParticipants: eligibilityForm.maxParticipants || null,
              })
            }
          >
            {saving ? "Saving..." : "Save Eligibility"}
          </button>
        </div>
      )}

      {/* ─── Sections Tab ───────────────────────────── */}
      {activeTab === "sections" && (
        <div>
          <h3>Sections</h3>
          {sections.length > 0 ? (
            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "20px" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #ddd" }}>
                  <th style={{ textAlign: "left", padding: "8px" }}>Title</th>
                  <th style={{ textAlign: "left", padding: "8px" }}>Slug</th>
                  <th style={{ textAlign: "left", padding: "8px" }}>Order</th>
                  <th style={{ textAlign: "left", padding: "8px" }}>Questions</th>
                </tr>
              </thead>
              <tbody>
                {sections.map((s) => (
                  <tr key={s.id} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: "8px" }}>{s.title}</td>
                    <td style={{ padding: "8px" }}>{s.slug}</td>
                    <td style={{ padding: "8px" }}>{s.displayOrder}</td>
                    <td style={{ padding: "8px" }}>{s.totalQuestions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p style={{ color: "#666" }}>No sections yet.</p>
          )}
          <h4>Create Section</h4>
          <label>
            Title:{" "}
            <input
              type="text"
              style={inputStyle}
              value={sectionForm.title}
              onChange={(e) => setSectionForm({ ...sectionForm, title: e.target.value })}
            />
          </label>
          <label>
            Slug:{" "}
            <input
              type="text"
              style={inputStyle}
              value={sectionForm.slug}
              onChange={(e) => setSectionForm({ ...sectionForm, slug: e.target.value })}
            />
          </label>
          <label>
            Description:{" "}
            <input
              type="text"
              style={inputStyle}
              value={sectionForm.description}
              onChange={(e) => setSectionForm({ ...sectionForm, description: e.target.value })}
            />
          </label>
          <label>
            Display Order:{" "}
            <input
              type="number"
              style={inputStyle}
              value={sectionForm.displayOrder}
              onChange={(e) =>
                setSectionForm({ ...sectionForm, displayOrder: parseInt(e.target.value) || 0 })
              }
            />
          </label>
          <button style={btnStyle} disabled={saving} onClick={handleCreateSection}>
            {saving ? "Creating..." : "Create Section"}
          </button>
        </div>
      )}

      {/* ─── Questions Tab ──────────────────────────── */}
      {activeTab === "questions" && (
        <div>
          <h3>Mapped Questions</h3>
          {questions.length > 0 ? (
            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "20px" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #ddd" }}>
                  <th style={{ textAlign: "left", padding: "8px" }}>Question ID</th>
                  <th style={{ textAlign: "left", padding: "8px" }}>Marks</th>
                  <th style={{ textAlign: "left", padding: "8px" }}>Order</th>
                  <th style={{ textAlign: "left", padding: "8px" }}>Section</th>
                </tr>
              </thead>
              <tbody>
                {questions.map((q) => (
                  <tr key={q.id} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: "8px", fontFamily: "monospace", fontSize: "12px" }}>
                      {q.questionId}
                    </td>
                    <td style={{ padding: "8px" }}>{q.marks}</td>
                    <td style={{ padding: "8px" }}>{q.displayOrder}</td>
                    <td style={{ padding: "8px" }}>{q.sectionId || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p style={{ color: "#666" }}>No questions mapped yet.</p>
          )}
          <h4>Add Question</h4>
          <label>
            Question ID:{" "}
            <input
              type="text"
              style={inputStyle}
              value={questionForm.questionId}
              onChange={(e) => setQuestionForm({ ...questionForm, questionId: e.target.value })}
            />
          </label>
          <label>
            Section ID (optional):{" "}
            <input
              type="text"
              style={inputStyle}
              value={questionForm.sectionId}
              onChange={(e) => setQuestionForm({ ...questionForm, sectionId: e.target.value })}
            />
          </label>
          <label>
            Marks:{" "}
            <input
              type="number"
              style={inputStyle}
              value={questionForm.marks}
              onChange={(e) =>
                setQuestionForm({ ...questionForm, marks: parseInt(e.target.value) || 1 })
              }
            />
          </label>
          <button style={btnStyle} disabled={saving} onClick={handleAddQuestion}>
            {saving ? "Adding..." : "Add Question"}
          </button>
        </div>
      )}

      {/* ─── Lifecycle Tab ──────────────────────────── */}
      {activeTab === "lifecycle" && (
        <div>
          <h3>Lifecycle Management</h3>
          {lifecycleInfo ? (
            <div style={{ marginBottom: "20px" }}>
              <p>
                <strong>Current State:</strong> {lifecycleInfo.currentState}
              </p>
              <p>
                <strong>Status:</strong> {lifecycleInfo.status}
              </p>
              <p>
                <strong>Valid Next States:</strong>{" "}
                {lifecycleInfo.validTransitions.join(", ") || "None"}
              </p>

              {lifecycleInfo.validTransitions.length > 0 && (
                <div
                  style={{
                    marginTop: "16px",
                    padding: "10px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                  }}
                >
                  <h4>Transition State</h4>
                  <label>
                    Target State:
                    <select
                      style={{ ...inputStyle, marginBottom: "12px" }}
                      value={transitionForm.targetState}
                      onChange={(e) =>
                        setTransitionForm({ ...transitionForm, targetState: e.target.value })
                      }
                    >
                      <option value="">Select state...</option>
                      {lifecycleInfo.validTransitions.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Reason (optional):{" "}
                    <input
                      type="text"
                      style={inputStyle}
                      value={transitionForm.reason}
                      onChange={(e) =>
                        setTransitionForm({ ...transitionForm, reason: e.target.value })
                      }
                    />
                  </label>
                  <button
                    style={btnStyle}
                    disabled={saving || !transitionForm.targetState}
                    onClick={handleTransition}
                  >
                    {saving ? "Processing..." : "Transition State"}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <p style={{ color: "#666" }}>Loading lifecycle info...</p>
          )}
        </div>
      )}

      {/* ─── Schedule Tab ───────────────────────────── */}
      {activeTab === "schedule" && (
        <div>
          <h3>Competition Schedule</h3>
          {schedule && (
            <div
              style={{
                marginBottom: "20px",
                padding: "10px",
                background: "#f8fafc",
                borderRadius: "4px",
              }}
            >
              <p>
                <strong>Status:</strong> {schedule.status}
              </p>
              <p>
                <strong>Publish At:</strong>{" "}
                {schedule.publishAt ? new Date(schedule.publishAt).toLocaleString() : "Not set"}
              </p>
              <p>
                <strong>Expires At:</strong>{" "}
                {schedule.expiresAt ? new Date(schedule.expiresAt).toLocaleString() : "Not set"}
              </p>
            </div>
          )}

          <div style={{ padding: "10px", border: "1px solid #ddd", borderRadius: "4px" }}>
            <h4>Set Schedule</h4>
            <label>
              Publish At:{" "}
              <input
                type="datetime-local"
                style={inputStyle}
                value={scheduleForm.publishAt}
                onChange={(e) => setScheduleForm({ ...scheduleForm, publishAt: e.target.value })}
              />
            </label>
            <label>
              Expires At (optional):{" "}
              <input
                type="datetime-local"
                style={inputStyle}
                value={scheduleForm.expiresAt}
                onChange={(e) => setScheduleForm({ ...scheduleForm, expiresAt: e.target.value })}
              />
            </label>
            <label>
              Timezone:{" "}
              <input
                type="text"
                style={inputStyle}
                value={scheduleForm.timezone}
                onChange={(e) => setScheduleForm({ ...scheduleForm, timezone: e.target.value })}
              />
            </label>
            <button style={btnStyle} disabled={saving} onClick={handleSchedule}>
              {saving ? "Scheduling..." : "Save Schedule"}
            </button>
          </div>
        </div>
      )}

      {/* ─── Audit Tab ──────────────────────────────── */}
      {activeTab === "audit" && (
        <div>
          <h3>Lifecycle Audit Log</h3>
          {auditLog.length > 0 ? (
            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "20px" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #ddd" }}>
                  <th style={{ textAlign: "left", padding: "8px" }}>Time</th>
                  <th style={{ textAlign: "left", padding: "8px" }}>Transition</th>
                  <th style={{ textAlign: "left", padding: "8px" }}>Actor</th>
                  <th style={{ textAlign: "left", padding: "8px" }}>Reason</th>
                </tr>
              </thead>
              <tbody>
                {auditLog.map((log) => (
                  <tr key={log.id} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: "8px", fontSize: "14px" }}>
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td style={{ padding: "8px", fontSize: "14px" }}>
                      {log.previousState || "NONE"} → <strong>{log.newState}</strong>
                    </td>
                    <td style={{ padding: "8px", fontSize: "14px" }}>{log.performedByType}</td>
                    <td style={{ padding: "8px", fontSize: "14px" }}>{log.reason || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p style={{ color: "#666" }}>No audit logs found.</p>
          )}
        </div>
      )}
    </div>
  );
}
