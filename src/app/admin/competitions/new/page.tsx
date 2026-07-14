"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateCompetition() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    competitionType: "EXAM",
    durationMinutes: 60,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch("/api/admin/competitions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          durationMinutes: Number(formData.durationMinutes),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create competition");
      }

      router.push("/admin/competitions");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "500px" }}>
      <h1>Create Competition</h1>
      <button onClick={() => router.push("/admin/competitions")} style={{ marginBottom: "20px" }}>
        Back to List
      </button>

      {error && <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>}

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "10px" }}
      >
        <label>
          Title:
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            style={{ width: "100%" }}
          />
        </label>
        <label>
          Slug:
          <input
            type="text"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            required
            style={{ width: "100%" }}
          />
        </label>
        <label>
          Description:
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            style={{ width: "100%" }}
          />
        </label>
        <label>
          Type:
          <select
            value={formData.competitionType}
            onChange={(e) => setFormData({ ...formData, competitionType: e.target.value })}
            style={{ width: "100%" }}
          >
            <option value="EXAM">EXAM</option>
            <option value="HACKATHON">HACKATHON</option>
            <option value="TOURNAMENT">TOURNAMENT</option>
            <option value="PRACTICE">PRACTICE</option>
            <option value="SCHOLARSHIP">SCHOLARSHIP</option>
          </select>
        </label>
        <label>
          Duration (Minutes):
          <input
            type="number"
            value={formData.durationMinutes}
            onChange={(e) => setFormData({ ...formData, durationMinutes: Number(e.target.value) })}
            required
            min="1"
            style={{ width: "100%" }}
          />
        </label>
        <button type="submit" style={{ marginTop: "10px" }}>
          Create
        </button>
      </form>
    </div>
  );
}
