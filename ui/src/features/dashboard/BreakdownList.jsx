const STATUS_COLOR_VAR = {
  new: "var(--color-brand)",
  in_progress: "var(--color-warning)",
  converted: "var(--color-good)",
  lost: "var(--color-text-muted)",
};

const CHANCE_COLOR_VAR = {
  hot: "var(--color-chance-hot)",
  warm: "var(--color-chance-warm)",
  cold: "var(--color-chance-cold)",
};

const BreakdownList = ({ rows, labelKey, labels, colorMap }) => {
  const total = rows.reduce((sum, row) => sum + Number(row.count), 0) || 1;

  return (
    <div className="breakdown-list">
      {rows.map((row) => {
        const key = row[labelKey];
        const count = Number(row.count);
        const pct = Math.round((count / total) * 100);
        return (
          <div className="breakdown-list__row" key={key}>
            <span>{labels[key] || key}</span>
            <div className="breakdown-list__track">
              <div
                className="breakdown-list__fill"
                style={{ width: `${pct}%`, background: colorMap[key] }}
              />
            </div>
            <span>{count}</span>
          </div>
        );
      })}
    </div>
  );
};

export const StatusBreakdownList = ({ rows, labels }) => (
  <BreakdownList rows={rows} labelKey="status" labels={labels} colorMap={STATUS_COLOR_VAR} />
);

export const ChanceBreakdownList = ({ rows, labels }) => (
  <BreakdownList rows={rows} labelKey="businessChance" labels={labels} colorMap={CHANCE_COLOR_VAR} />
);
