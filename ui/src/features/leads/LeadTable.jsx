import { useNavigate } from "react-router-dom";
import Table from "../../components/common/Table";
import { StatusBadge, ChanceBadge } from "../../components/common/Badge";
import { formatDate, isOverdue } from "../../utils/formatters";

const LeadTable = ({ leads, showOwner = false }) => {
  const navigate = useNavigate();

  const columns = [
    { key: "contactName", label: "Contact" },
    { key: "companyName", label: "Company" },
    { key: "area", label: "Area" },
    ...(showOwner ? [{ key: "owner", label: "Owner", render: (l) => l.owner?.name || "—" }] : []),
    { key: "chance", label: "Chance", render: (l) => <ChanceBadge chance={l.businessChance} /> },
    { key: "status", label: "Status", render: (l) => <StatusBadge status={l.status} /> },
    { key: "metOn", label: "Met On", render: (l) => formatDate(l.metOn) },
    {
      key: "nextFollowupOn",
      label: "Follow-up",
      render: (l) =>
        l.nextFollowupOn ? (
          <span className={isOverdue(l.nextFollowupOn) ? "overdue-flag" : ""}>
            {formatDate(l.nextFollowupOn)}
            {isOverdue(l.nextFollowupOn) ? " (overdue)" : ""}
          </span>
        ) : (
          "—"
        ),
    },
  ];

  const renderMobileCard = (lead) => (
    <div className="row-card">
      <div className="row-card__top">
        <span className="row-card__title">{lead.contactName}</span>
        <ChanceBadge chance={lead.businessChance} />
      </div>
      <div className="row-card__meta">
        <span>{lead.companyName}</span>
        <span>{lead.area}</span>
        {showOwner && <span>{lead.owner?.name}</span>}
      </div>
      <div className="row-card__meta">
        <StatusBadge status={lead.status} />
        <span>Met {formatDate(lead.metOn)}</span>
        {lead.nextFollowupOn && (
          <span className={isOverdue(lead.nextFollowupOn) ? "overdue-flag" : ""}>
            Follow-up {formatDate(lead.nextFollowupOn)}
            {isOverdue(lead.nextFollowupOn) ? " (overdue)" : ""}
          </span>
        )}
      </div>
    </div>
  );

  return (
    <Table
      columns={columns}
      rows={leads}
      onRowClick={(lead) => navigate(`/leads/${lead.id}`)}
      renderMobileCard={renderMobileCard}
    />
  );
};

export default LeadTable;
