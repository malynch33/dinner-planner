"use client";

import { useState } from "react";

const allDays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default function Home() {
  const [startWeek, setStartWeek] = useState("");
  const [cookDays, setCookDays] = useState(["Sunday", "Monday"]);
  const [plan, setPlan] = useState<any>(null);

  const toggleDay = (day: string) => {
    setCookDays((prev) =>
      prev.includes(day)
        ? prev.filter((d) => d !== day)
        : [...prev, day]
    );
  };

  const generatePlan = async () => {
    const res = await fetch("/api/plan/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ startWeek, cookDays }),
    });

    const data = await res.json();
    setPlan(data);
  };

  return (
    <main style={{ padding: 40 }}>
      <h1>Dinner Planner</h1>

      <div style={{ marginBottom: 20 }}>
        <label>Start Week: </label>
        <input
          type="date"
          value={startWeek}
          onChange={(e) => setStartWeek(e.target.value)}
        />
      </div>

      <div style={{ marginBottom: 20 }}>
        <h3>Select Cook Days:</h3>
        {allDays.map((day) => (
          <label key={day} style={{ display: "block" }}>
            <input
              type="checkbox"
              checked={cookDays.includes(day)}
              onChange={() => toggleDay(day)}
            />
            {day}
          </label>
        ))}
      </div>

      <button onClick={generatePlan}>Generate Plan</button>

      {plan && (
        <div style={{ marginTop: 40 }}>
          <h2>Weekly Plan</h2>
          {allDays.map((day) => (
            <div key={day}>
              <strong>{day}:</strong>{" "}
              {plan.fields?.[day]?.[0] || "—"}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}