import { useState } from "react";

export default function JournalForm({ onSubmit }) {
  const [content, setContent] = useState("");
  return (
    <form
      className="journal-form"
      onSubmit={e => {
        e.preventDefault();
        if (!content.trim()) return;
        onSubmit(content);
        setContent("");
      }}
    >
      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="How was your day?"
        rows={4}
      />
      <button type="submit">Add Entry</button>
    </form>
  );
}