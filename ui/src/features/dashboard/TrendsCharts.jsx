import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import Card from "../../components/common/Card";
import EmptyState from "../../components/common/EmptyState";
import { formatPercent } from "../../utils/formatters";

const formatMonth = (value) =>
  new Date(value).toLocaleDateString(undefined, { month: "short", year: "2-digit" });

// Two separate charts, each on its own axis — leads/converted share a count
// axis, conversion ratio gets its own percentage axis. Never combined.
const TrendsCharts = ({ trends }) => {
  if (!trends || trends.length === 0) {
    return (
      <Card title="Trends">
        <EmptyState title="Not enough data yet" />
      </Card>
    );
  }

  const data = trends.map((row) => ({
    ...row,
    monthLabel: formatMonth(row.month),
  }));

  return (
    <div className="grid grid--cols-2">
      <Card title="Leads Created vs Converted (last 12 months)">
        <div className="chart-frame">
          <ResponsiveContainer>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
              <XAxis dataKey="monthLabel" stroke="var(--chart-axis)" fontSize={12} />
              <YAxis stroke="var(--chart-axis)" fontSize={12} allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="leadCount" name="Leads Created" fill="var(--chart-series-1)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="convertedCount" name="Converted" fill="var(--chart-series-2)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card title="Conversion Ratio Trend">
        <div className="chart-frame">
          <ResponsiveContainer>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
              <XAxis dataKey="monthLabel" stroke="var(--chart-axis)" fontSize={12} />
              <YAxis
                stroke="var(--chart-axis)"
                fontSize={12}
                tickFormatter={(v) => formatPercent(v)}
              />
              <Tooltip formatter={(value) => formatPercent(value, 1)} />
              <Line
                type="monotone"
                dataKey="conversionRatio"
                name="Conversion Ratio"
                stroke="var(--chart-series-1)"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

export default TrendsCharts;
