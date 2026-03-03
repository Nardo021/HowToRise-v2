"use client";

import { useEffect, useState } from "react";

type DashboardData = {
  pv: number;
  uv: number;
  avgDurationSec: number;
  topPages: [string, number][];
  topTutorials: [string, number][];
  countries: [string, number][];
  sources: [string, number][];
  trend: [string, number][];
};

export default function AdminAnalyticsPage() {
  const [range, setRange] = useState("7d");
  const [locale, setLocale] = useState("all");
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    void fetch(`/api/admin/analytics?range=${range}&locale=${locale}`)
      .then((res) => res.json())
      .then(setData);
  }, [range, locale]);

  return (
    <main>
      <h1>Analytics Dashboard</h1>
      <div className="card">
        <label>
          Range
          <select value={range} onChange={(e) => setRange(e.target.value)}>
            <option value="24h">24h</option>
            <option value="7d">7d</option>
            <option value="30d">30d</option>
          </select>
        </label>
        <label>
          Locale
          <select value={locale} onChange={(e) => setLocale(e.target.value)}>
            <option value="all">all</option>
            <option value="zh">zh</option>
            <option value="en">en</option>
          </select>
        </label>
      </div>
      {data ? (
        <>
          <section className="card">
            <p>PV: {data.pv}</p>
            <p>UV: {data.uv}</p>
            <p>Avg Duration(s): {data.avgDurationSec}</p>
          </section>
          <section className="card">
            <h3>Top Pages</h3>
            {data.topPages.map(([k, v]) => (
              <p key={k}>
                {k}: {v}
              </p>
            ))}
          </section>
          <section className="card">
            <h3>Top Tutorials</h3>
            {data.topTutorials.map(([k, v]) => (
              <p key={k}>
                {k}: {v}
              </p>
            ))}
          </section>
          <section className="card">
            <h3>Countries</h3>
            {data.countries.map(([k, v]) => (
              <p key={k}>
                {k}: {v}
              </p>
            ))}
          </section>
          <section className="card">
            <h3>Sources</h3>
            {data.sources.map(([k, v]) => (
              <p key={k}>
                {k}: {v}
              </p>
            ))}
          </section>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </main>
  );
}
