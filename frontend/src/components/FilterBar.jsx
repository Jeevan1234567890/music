import React from "react";

export const moods = [
  "Happy",
  "Sad",
  "Relaxed",
  "Energy",
  "Focus",
  "Sleep",
  "Love",
  "Angry",
];

export default function FilterBar({ language, mood, setMood }) {
  return (
    <div className="filter-bar" style={styles.bar}>
      <span style={styles.label}>Language: {language}</span>
      <select
        value={mood}
        onChange={(e) => setMood(e.target.value)}
        style={styles.select}
        aria-label="Mood filter"
      >
        <option value="">All Moods</option>
        {moods.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>
    </div>
  );
}

const styles = {
  bar: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    marginBottom: "1rem",
    background: "rgba(255,255,255,0.15)",
    backdropFilter: "blur(8px)",
    borderRadius: "8px",
    padding: "0.6rem 1rem",
  },
  label: { fontWeight: "500" },
  select: {
    padding: "0.4rem 0.6rem",
    borderRadius: "4px",
    border: "1px solid #ccc",
    background: "var(--bg)",
    color: "var(--text)",
  },
};
