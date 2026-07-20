import { useMediaQuery } from "../../hooks/useMediaQuery";

// Below 768px a data table stops being usable even with horizontal scroll,
// so mobile gets a stacked card per row instead — same data, laid out for a
// thumb rather than a cursor.
const Table = ({ columns, rows, keyField = "id", onRowClick, renderMobileCard }) => {
  const isMobile = useMediaQuery("(max-width: 767px)");

  if (isMobile && renderMobileCard) {
    return (
      <div className="stack">
        {rows.map((row) => (
          <div key={row[keyField]} onClick={() => onRowClick?.(row)}>
            {renderMobileCard(row)}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="table-wrap">
      <table className={`table ${onRowClick ? "table--clickable" : ""}`}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[keyField]} onClick={() => onRowClick?.(row)}>
              {columns.map((col) => (
                <td key={col.key}>{col.render ? col.render(row) : row[col.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
