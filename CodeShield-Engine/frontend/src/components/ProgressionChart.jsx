import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  const point = payload[0].payload;
  return (
    <div className="bg-shield-bg-elevated border border-shield-border-glow/50 rounded-lg px-3 py-2 shadow-xl text-xs font-mono">
      <p className="text-shield-text-muted mb-1">{label}</p>
      <p className="text-shield-accent font-semibold">{point.cumulativeSolved} total solved</p>
      {point.solvedOnDay > 0 && (
        <p className="text-shield-text-secondary">+{point.solvedOnDay} that day</p>
      )}
    </div>
  );
}

/**
 * Renders a cumulative "challenges solved over time" area chart. Expects
 * `timeline` as an array of { date: 'YYYY-MM-DD', solvedOnDay, cumulativeSolved },
 * already sorted ascending by date (see GET /api/auth/me).
 */
export default function ProgressionChart({ timeline }) {
  const data = timeline || [];

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 gap-2 text-center px-4">
        <span className="text-2xl">📈</span>
        <p className="text-xs text-shield-text-muted">
          Solve your first challenge to start tracking your progression over time.
        </p>
      </div>
    );
  }

  // Format dates for the X axis (e.g. "Jun 18") without pulling in a date library.
  const formatted = data.map((point) => {
    const d = new Date(`${point.date}T00:00:00.000Z`);
    return {
      ...point,
      label: d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', timeZone: 'UTC' }),
    };
  });

  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={formatted} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <defs>
            <linearGradient id="solvedGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--shield-accent)" stopOpacity={0.45} />
              <stop offset="100%" stopColor="var(--shield-accent)" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="var(--shield-border)" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fill: 'var(--shield-text-muted)', fontSize: 11, fontFamily: 'monospace' }}
            axisLine={{ stroke: 'var(--shield-border)' }}
            tickLine={false}
            minTickGap={24}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fill: 'var(--shield-text-muted)', fontSize: 11, fontFamily: 'monospace' }}
            axisLine={false}
            tickLine={false}
            width={28}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="cumulativeSolved"
            stroke="var(--shield-accent)"
            strokeWidth={2.5}
            fill="url(#solvedGradient)"
            dot={{ r: 3, fill: 'var(--shield-accent)', strokeWidth: 0 }}
            activeDot={{ r: 5, fill: 'var(--shield-accent)', stroke: 'var(--shield-bg-panel)', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
