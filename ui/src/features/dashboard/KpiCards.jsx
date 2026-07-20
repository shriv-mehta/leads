import Card from "../../components/common/Card";
import StatTile from "../../components/common/StatTile";
import { StatusBreakdownList, ChanceBreakdownList } from "./BreakdownList";
import { formatPercent } from "../../utils/formatters";
import { STATUS_LABELS, CHANCE_LABELS } from "../../utils/constants";

const KpiCards = ({ kpis }) => (
  <div className="grid grid--cols-3">
    <Card>
      <StatTile label="Total Leads" value={kpis.totalLeads.ytd} mtd={kpis.totalLeads.mtd} ytd={kpis.totalLeads.ytd} />
    </Card>
    <Card>
      <StatTile
        label="Leads Converted"
        value={kpis.leadsConverted.ytd}
        mtd={kpis.leadsConverted.mtd}
        ytd={kpis.leadsConverted.ytd}
      />
    </Card>
    <Card>
      <StatTile
        label="Conversion Ratio"
        value={formatPercent(kpis.conversionRatio.ytd)}
        mtd={formatPercent(kpis.conversionRatio.mtd)}
        ytd={formatPercent(kpis.conversionRatio.ytd)}
      />
    </Card>
    <Card title="Leads by Status">
      <StatusBreakdownList rows={kpis.statusBreakdown} labels={STATUS_LABELS} />
    </Card>
    <Card title="Leads by Business Chance">
      <ChanceBreakdownList rows={kpis.chanceBreakdown} labels={CHANCE_LABELS} />
    </Card>
  </div>
);

export default KpiCards;
