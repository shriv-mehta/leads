import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import Card from "../../components/common/Card";
import EmptyState from "../../components/common/EmptyState";

// Single series ranked by value — one hue is correct here, there's no
// identity to distinguish beyond the employee name already on the axis.
const EmployeeLeadsChart = ({ employees }) => {
  const data = [...(employees || [])]
    .sort((a, b) => b.leadsYtd - a.leadsYtd)
    .map((e) => ({ name: e.name, leads: e.leadsYtd }));

  if (data.length === 0) {
    return (
      <Card title="Leads per Employee (YTD)">
        <EmptyState title="No employees yet" />
      </Card>
    );
  }

  return (
    <Card title="Leads per Employee (YTD)">
      <div className="chart-frame">
        <ResponsiveContainer>
          <BarChart data={data} layout="vertical" margin={{ left: 16 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" horizontal={false} />
            <XAxis type="number" stroke="var(--chart-axis)" fontSize={12} allowDecimals={false} />
            <YAxis type="category" dataKey="name" stroke="var(--chart-axis)" fontSize={12} width={100} />
            <Tooltip />
            <Bar dataKey="leads" name="Leads" fill="var(--chart-series-1)" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default EmployeeLeadsChart;
