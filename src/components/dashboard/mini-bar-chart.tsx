interface MiniBarChartProps {
  values: number[];
  labels?: string[];
}

export function MiniBarChart({ values, labels }: MiniBarChartProps) {
  const fallbackValues = values.length > 0 ? values : [0];
  const max = Math.max(...fallbackValues, 1);

  return (
    <div className="flex h-44 items-end gap-2 rounded-[1.8rem] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.9)_0%,rgba(255,247,237,0.82)_100%)] p-4">
      {fallbackValues.map((value, index) => (
        <div key={`${value}-${index}`} className="flex flex-1 flex-col justify-end gap-2">
          <div
            className="rounded-t-[1rem] bg-[linear-gradient(180deg,#f59e0b_0%,#38bdf8_100%)]"
            style={{ height: `${Math.max((value / max) * 100, 14)}%` }}
          />
          <span className="text-center text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-stone-400">
            {labels?.[index] ?? index + 1}
          </span>
        </div>
      ))}
    </div>
  );
}
