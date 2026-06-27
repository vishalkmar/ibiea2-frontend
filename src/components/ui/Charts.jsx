import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, LabelList,
  AreaChart, Area, CartesianGrid, PieChart, Pie,
} from 'recharts';

// Brand palette
const GOLD = '#D4AF37';
const GOLD_LIGHT = '#E0C05A';
const GOLD_DARK = '#C89B1D';

// Shared gold gradient defs
function GoldDefs() {
  return (
    <defs>
      <linearGradient id="goldBar" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={GOLD_LIGHT} />
        <stop offset="100%" stopColor={GOLD_DARK} />
      </linearGradient>
      <linearGradient id="goldArea" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={GOLD} stopOpacity={0.45} />
        <stop offset="100%" stopColor={GOLD} stopOpacity={0.02} />
      </linearGradient>
    </defs>
  );
}

// Premium navy+gold tooltip — shows the real value (from row payload, not scaled height)
function GoldTooltip({ active, payload, label, suffix = '' }) {
  if (!active || !payload?.length) return null;
  const row = payload[0].payload || {};
  const real = row.value ?? payload[0].value;
  return (
    <div className="rounded-xl bg-navy-900/95 border border-gold/30 px-3.5 py-2 shadow-card backdrop-blur">
      {label && <p className="text-cream/70 text-xs mb-0.5">{label}</p>}
      <p className="text-gold font-bold text-sm">{real}{row.suffix ?? suffix}</p>
    </div>
  );
}

const axisTick = { fill: 'rgba(245,241,230,0.6)', fontSize: 11 };

// Vertical gold bar chart with value labels on top (supports per-row suffix).
// `balanced`: compress bar heights (sqrt scale) so small + large values read evenly,
// while labels/tooltips still show the REAL numbers.
export function StatBarChart({ data, height = 300, showValueLabels = true, suffix = '', balanced = false }) {
  const max = Math.max(...data.map((d) => Number(d.value) || 0), 1);
  const chartData = data.map((d) => {
    const v = Number(d.value) || 0;
    const h = balanced ? Math.max(max * 0.16, (Math.sqrt(v) / Math.sqrt(max)) * max) : v;
    return { ...d, _h: h };
  });

  const renderLabel = (props) => {
    const { x, y, width, index } = props;
    const row = data[index] || {};
    return (
      <text x={x + width / 2} y={y - 10} textAnchor="middle" fill={GOLD_LIGHT} fontSize={16} fontWeight={800} fontFamily="Playfair Display, serif">
        {row.value}{row.suffix ?? suffix}
      </text>
    );
  };
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={chartData} margin={{ top: 30, right: 8, left: 8, bottom: 4 }}>
        <GoldDefs />
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(212,175,55,0.08)" vertical={false} />
        <XAxis dataKey="label" tick={axisTick} axisLine={{ stroke: 'rgba(212,175,55,0.25)' }} tickLine={false} interval={0} angle={data.length > 6 ? -15 : 0} textAnchor={data.length > 6 ? 'end' : 'middle'} height={data.length > 6 ? 54 : 30} />
        <YAxis hide domain={[0, max]} />
        <Tooltip cursor={{ fill: 'rgba(212,175,55,0.06)' }} content={<GoldTooltip suffix={suffix} />} />
        <Bar dataKey="_h" fill="url(#goldBar)" radius={[8, 8, 0, 0]} maxBarSize={64} isAnimationActive animationDuration={1200}>
          {showValueLabels && <LabelList content={renderLabel} />}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

// Horizontal gold bars (good for ranked lists / popularity).
export function HBarChart({ data, height = 240, suffix = '' }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 30, left: 8, bottom: 4 }}>
        <GoldDefs />
        <XAxis type="number" hide />
        <YAxis type="category" dataKey="label" tick={axisTick} axisLine={false} tickLine={false} width={110} />
        <Tooltip cursor={{ fill: 'rgba(212,175,55,0.06)' }} content={<GoldTooltip suffix={suffix} />} />
        <Bar dataKey="value" fill="url(#goldBar)" radius={[0, 8, 8, 0]} maxBarSize={26} isAnimationActive animationDuration={1100}>
          <LabelList dataKey="value" position="right" fill={GOLD_LIGHT} fontSize={12} fontWeight={700} formatter={(v) => `${v}${suffix}`} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

// Gold area trend (e.g. registrations over time).
export function AreaTrend({ data, height = 260, suffix = '' }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 10, right: 12, left: 0, bottom: 4 }}>
        <GoldDefs />
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(212,175,55,0.08)" vertical={false} />
        <XAxis dataKey="label" tick={axisTick} axisLine={{ stroke: 'rgba(212,175,55,0.25)' }} tickLine={false} />
        <YAxis tick={axisTick} axisLine={false} tickLine={false} width={32} />
        <Tooltip content={<GoldTooltip suffix={suffix} />} />
        <Area type="monotone" dataKey="value" stroke={GOLD} strokeWidth={2.5} fill="url(#goldArea)" isAnimationActive animationDuration={1300}
          dot={{ r: 3, fill: GOLD, strokeWidth: 0 }} activeDot={{ r: 5, fill: GOLD_LIGHT }} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// Donut showing a single percentage (e.g. floor occupancy, satisfaction).
export function DonutStat({ value, label, size = 180 }) {
  const pct = Math.max(0, Math.min(100, Number(value) || 0));
  const data = [{ name: 'v', value: pct }, { name: 'rest', value: 100 - pct }];
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <GoldDefs />
          <Pie data={data} dataKey="value" innerRadius="72%" outerRadius="100%" startAngle={90} endAngle={-270} stroke="none" isAnimationActive animationDuration={1100}>
            <Cell fill="url(#goldBar)" />
            <Cell fill="rgba(255,255,255,0.06)" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-3xl font-extrabold text-gradient-gold">{pct}%</span>
        {label && <span className="text-[11px] text-cream/60 uppercase tracking-wide mt-0.5">{label}</span>}
      </div>
    </div>
  );
}
