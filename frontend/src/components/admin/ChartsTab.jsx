import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from "recharts";
import { Panel } from "../ui";
import client from "../../api/client";

export default function ChartsTab() {
  const [summary, setSummary] = useState([]);

  useEffect(() => {
    client.get("/placement/summary").then(({ data }) => setSummary(data.summary));
  }, []);

  const chartData = summary.map((s) => ({ name: s.code, Female: s.female, Male: s.male }));

  return (
    <div>
      <Panel className="p-6 mb-4">
        <div className="font-semibold mb-3.5">Allocation by department & gender</div>
        <div className="w-full h-80">
          <ResponsiveContainer>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#D9D2BF" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#5B5647" }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#5B5647" }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="Female" fill="#B8862F" />
              <Bar dataKey="Male" fill="#1F3A5F" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Panel>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
        {summary.map((s) => (
          <Panel key={s.code} className="p-4.5">
            <div className="font-semibold text-sm mb-2.5">{s.name}</div>
            <div className="text-xs text-inksoft leading-loose">
              Placed: <strong className="text-ink">{s.filled}</strong><br />
              Highest CGPA: <strong className="text-ink">{s.highestCgpa ?? "—"}</strong><br />
              Lowest CGPA: <strong className="text-ink">{s.lowestCgpa ?? "—"}</strong>
            </div>
          </Panel>
        ))}
      </div>
    </div>
  );
}
