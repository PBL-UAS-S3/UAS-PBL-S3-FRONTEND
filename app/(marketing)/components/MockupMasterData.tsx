export function MockupMasterData() {
  return (
    <div className="bg-white border-2 border-slate-200 rounded-lg overflow-hidden text-[9px]">
      <div className="bg-[#DBE5FB] px-2 py-1.5 font-bold text-[#172554] flex justify-between">
        <span>Produk</span>
        <span>Stok</span>
        <span>Status</span>
      </div>
      {['Kabel HDMI', 'Mouse Wireless', 'Keyboard'].map((n, i) => (
        <div
          key={n}
          className="flex items-center justify-between px-2 py-1.5 border-b border-slate-100"
        >
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-4 rounded bg-[#E8EEFC] shrink-0" />
            <span className="text-slate-700">{n}</span>
          </div>
          <span className="font-bold text-slate-900">{[12, 3, 24][i]}</span>
          <span
            className={`px-1.5 py-0.5 rounded-full text-[8px] font-bold ${
              i === 1 ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
            }`}
          >
            {i === 1 ? 'Menipis' : 'Aman'}
          </span>
        </div>
      ))}
    </div>
  );
}