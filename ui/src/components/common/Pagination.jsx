import Button from "./Button";

const Pagination = ({ page, totalPages, onChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="pagination">
      <Button
        variant="secondary"
        size="sm"
        label="Prev"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
      />
      <span className="pagination__info">
        Page {page} of {totalPages}
      </span>
      <Button
        variant="secondary"
        size="sm"
        label="Next"
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
      />
    </div>
  );
};

export default Pagination;
