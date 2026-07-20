const StatTile = ({ label, value, mtd, ytd }) => (
  <div className="stat-tile">
    <span className="stat-tile__label">{label}</span>
    <span className="stat-tile__value">{value}</span>
    {(mtd !== undefined || ytd !== undefined) && (
      <div className="stat-tile__sub">
        {mtd !== undefined && <span>MTD: {mtd}</span>}
        {ytd !== undefined && <span>YTD: {ytd}</span>}
      </div>
    )}
  </div>
);

export default StatTile;
