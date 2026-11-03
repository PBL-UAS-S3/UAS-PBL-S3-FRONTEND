export function MockupMini({
  judul,
  children,
}: {
  judul: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-md border-2 border-slate-200 overflow-hidden h-full">
      <div className="bg-slate-100 border-b-2 border-slate-200 px-3 py-2 flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-red-400" />
        <span className="w-2 h-2 rounded-full bg-amber-400" />
        <span className="w-2 h-2 rounded-full bg-emerald-400" />
        <span className="ml-2 text-[10px] text-slate-400">{judul}</span>
      </div>
      <div className="p-3 bg-[#F4F6FB] h-[180px]">{children}</div>
    </div>
  );
}