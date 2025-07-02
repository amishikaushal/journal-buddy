export default function MoodDisplay({ mood, message }) {
  if (!mood) return null;
  return (
    <div className="mood-display">
      <strong>Mood:</strong> {mood}
      <div>{message}</div>
    </div>
  );
}