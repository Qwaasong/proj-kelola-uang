/**
 * Komponen SummaryCard untuk menampilkan ringkasan keuangan.
 * Props:
 * - title: string — judul kartu (misal: "Pemasukan")
 * - amount: string — nominal uang yang ditampilkan
 * - icon: ReactNode — ikon opsional untuk variasi visual
 */
const SummaryCard = ({ title, amount }) => (
    <div className="bg-white p-6 rounded-[20px] shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] w-full hover:shadow-[0_8px_30px_-10px_rgba(0,0,0,0.08)] transition-shadow cursor-pointer">
        <h3 className="text-sm font-semibold mb-2">{title}</h3>
        <p className="text-[28px] font-semibold flex items-baseline gap-1">
            <span className="text-sm text-gray-400 font-medium">Rp</span> {amount}
        </p>
    </div>
);

export default SummaryCard;
