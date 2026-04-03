/**
 * Komponen SummaryCard untuk menampilkan ringkasan keuangan.
 * Props:
 * - title: string — judul kartu (misal: "Pemasukan")
 * - amount: string — nominal uang yang ditampilkan
 */
const SummaryCard = ({ title, amount, showRp = true, suffix = "" }) => (
    <div className="
    relative overflow-hidden rounded-xl bg-white p-6 
    ring-1 ring-gray-950/5 
    shadow-[0_2px_4px_rgba(0,0,0,0.05),0_1px_0_rgba(0,0,0,0.05)]
    dark:bg-gray-900 dark:ring-white/10 dark:shadow-none
    transition duration-300 hover:ring-gray-950/10
  ">
        <div className="flex flex-col gap-y-2">
            {/* Label/Title */}
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {title}
            </h3>

            {/* Value */}
            <div className="flex items-baseline gap-1">
                {showRp && <span className="text-sm font-semibold text-gray-400">Rp</span>}
                <span className="text-3xl font-bold tracking-tight text-gray-950 dark:text-white">
                    {amount}
                </span>
                {suffix && <span className="ml-1 text-sm font-semibold text-gray-400">{suffix}</span>}
            </div>
        </div>
    </div>
);


export default SummaryCard;
