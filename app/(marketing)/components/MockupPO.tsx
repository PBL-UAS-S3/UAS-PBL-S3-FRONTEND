const DATA_PO = [
  { no: 'PO-2026-003', jml: 25, status: 'Menunggu' },
  { no: 'PO-2026-002', jml: 10, status: 'Selesai' },
];

export function MockupPO() {
  return (
    <div className="bg-white border-2 border-slate-200 rounded-lg overflow-hidden text-[9px]">
      <div className="bg-[#DBE5FB] px-2 py-1.5 font-bold text-[#172554] flex justify-between">
        <span>No. PO</span>
        <span>Jumlah</span>
        <span>Status</span>
      </div>
      {DATA_PO.map((po) => (
        <div
          key={po.no}
          className="flex items-center justify-between px-2 py-1.5 border-b border-slate-100"
        >
          <span className="font-mono text-slate-600">{po.no}</span>
          <span className="font-bold text-slate-900">{po.jml}</span>
          <span
            className={`px-1.5 py-0.5 rounded-full text-[8px] font-bold ${
              po.status === 'Selesai'
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-amber-100 text-amber-800'
            }`}
          >
            {po.status}
          </span>
        </div>
      ))}
    </div>
  );
}