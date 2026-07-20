import { useState } from "react";
import TextArea from "../../components/common/TextArea";
import DatePicker from "../../components/common/DatePicker";
import Button from "../../components/common/Button";
import EmptyState from "../../components/common/EmptyState";
import { formatDate, todayDateOnly } from "../../utils/formatters";

const ActivityLog = ({ activities, onAdd, isSubmitting }) => {
  const [note, setNote] = useState("");
  const [activityDate, setActivityDate] = useState(todayDateOnly());

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!note.trim()) return;
    // Only clear the note on success — a failed save shouldn't lose what
    // the rep just typed.
    const succeeded = await onAdd({ note, activityDate });
    if (succeeded) setNote("");
  };

  return (
    <div className="stack">
      <form className="stack" onSubmit={handleSubmit}>
        <TextArea
          name="note"
          label="Add follow-up note"
          rows={2}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="What happened on this visit?"
        />
        <DatePicker
          name="activityDate"
          label="Activity date"
          value={activityDate}
          onChange={(e) => setActivityDate(e.target.value)}
        />
        <Button type="submit" label="Log Activity" size="sm" disabled={isSubmitting} />
      </form>

      {activities.length === 0 ? (
        <EmptyState icon="🗒️" title="No follow-ups logged yet" />
      ) : (
        <ul className="stack">
          {activities.map((activity) => (
            <li key={activity.id} className="row-card">
              <div className="row-card__top">
                <span className="row-card__title">{formatDate(activity.activityDate)}</span>
                <span className="row-card__meta">{activity.author?.name}</span>
              </div>
              <p>{activity.note}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ActivityLog;
