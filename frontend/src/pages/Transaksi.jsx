import { useState, useRef, useEffect, useMemo } from 'react';
import { 
    ArrowsLeftRight as ArrowsLeftRightIcon,
    Funnel as FunnelIcon, 
    MagnifyingGlass as MagnifyingGlassIcon, 
    CaretDown as CaretDownIcon, 
    CaretLeft as CaretLeftIcon, 
    CaretRight as CaretRightIcon,
    Trash as TrashIcon,
    PencilSimple as PencilSimpleIcon,
    TrendUp as TrendUpIcon,
    TrendDown as TrendDownIcon,
    Repeat as RepeatIcon,
    Calendar as CalendarIcon,
    ClockClockwise as ClockClockwiseIcon,
    Wallet as WalletIcon
} from '@phosphor-icons/react';
import TransaksiSkeleton from '../components/TransaksiSkeleton';
import Table from '../components/Table';
import Button from '../components/Button';
import Input from '../components/Input';
import Modal from '../components/Modal';
import Select from '../components/Select';
import useFirstLoad from '../hooks/useFirstLoad';
import useApi from '../hooks/useApi';
import { useNavigate } from 'react-router-dom';

const transactionTypes = [
    { id: 'Pemasukan', name: 'Pemasukan', icon: TrendUpIcon },
    { id: 'Pengeluaran', name: 'Pengeluaran', icon: TrendDownIcon },
];

/**
 * Halaman Transaksi — menampilkan daftar semua transaksi masuk/keluar.
 */
const Transaksi = () => {
    const navigate = useNavigate();
    const isFirstLoad = useFirstLoad('transaksi', 250);
    const [fetchTransactions, { data: txData, loading: loadingTx }] = useApi();
    const [fetchCats, { data: catData }] = useApi();
    const [fetchWallets, { data: walletData }] = useApi();
    const [actionApi, { loading: loadingAction }] = useApi();

    const [selectedRows, setSelectedRows] = useState([]);
    const [isBulkDropdownOpen, setIsBulkDropdownOpen] = useState(false);
    const bulkRef = useRef(null);

    // --- State Pagination & Search ---
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [limit] = useState(10);

    // --- State Modals ---
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingRow, setEditingRow] = useState(null);

    // --- State Form ---
    const [namaTransaksi, setNamaTransaksi] = useState('');
    const [type, setType] = useState('Pemasukan');
    const [walletId, setWalletId] = useState(null);
    const [categoryId, setCategoryId] = useState(null);
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [description, setDescription] = useState('');

    const loadData = async () => {
        try {
            await fetchTransactions('GET', `/transaksi?page=${page}&limit=${limit}&search=${search}`);
            if (!catData) await fetchCats('GET', '/kategori');
            if (!walletData) await fetchWallets('GET', '/dompet');
        } catch (err) {
            if (err.status === 401) navigate('/login');
        }
    };

    useEffect(() => {
        loadData();
    }, [fetchTransactions, page, search, navigate]);

    // Format options for Select
    const categories = useMemo(() => 
        (catData?.data || []).map(c => ({ 
            id: c.id, 
            name: c.nama_kategori, 
            icon: c.tipe === 'Pemasukan' ? TrendUpIcon : TrendDownIcon 
        })), [catData]);

    const wallets = useMemo(() => 
        (walletData?.data || []).map(w => ({ 
            id: w.id, 
            name: w.nama_dompet, 
            icon: WalletIcon 
        })), [walletData]);

    const handleSave = async (e) => {
        e.preventDefault();
        const payload = {
            nama_transaksi: namaTransaksi,
            jenis: type,
            jumlah: amount,
            tanggal: date,
            dompet_id: walletId,
            kategori_id: categoryId,
            keterangan: description,
            is_berulang: false 
        };

        try {
            if (isEditModalOpen) {
                // Backend put implementation might need refinement if it uses ?id=
                await actionApi('PUT', '/transaksi', { ...payload, id: editingRow.id });
                setIsEditModalOpen(false);
            } else {
                await actionApi('POST', '/transaksi', payload);
                setIsAddModalOpen(false);
            }
            loadData();
        } catch (err) {
            alert("Gagal menyimpan transaksi: " + err.message);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Hapus transaksi ini? Saldo dompet akan disesuaikan otomatis.")) return;
        try {
            await actionApi('DELETE', `/transaksi?id=${id}`);
            loadData();
        } catch (err) {
            alert("Gagal menghapus: " + err.message);
        }
    };

    const transactions = txData?.data?.data || [];
    const pagination = txData?.data?.pagination || {};

    const columns = [
        { label: 'Nama', key: 'nama_transaksi', className: 'font-bold text-secondary' },
        { label: 'Tipe', key: 'jenis', className: (val) => val === 'Pemasukan' ? 'text-green-600' : 'text-red-600' },
        { label: 'Jumlah', key: 'jumlah', render: (val) => `Rp ${new Intl.NumberFormat('id-ID').format(val)}` },
        { label: 'Tanggal', key: 'tanggal', className: 'text-gray-500' },
    ];

    if (isFirstLoad || (loadingTx && !txData)) return <TransaksiSkeleton />;

    return (
        <>
            <div className="flex justify-between items-center px-8 py-8 flex-shrink-0">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-semibold text-secondary">Transaksi</h1>
                    <p className="text-sm text-gray-500 font-medium">Kelola seluruh riwayat aktivitas keuangan anda</p>
                </div>
                <Button onClick={() => {
                    setNamaTransaksi(''); setAmount(''); setDescription(''); setWalletId(null); setCategoryId(null);
                    setIsAddModalOpen(true);
                }} size="md">
                    <ArrowsLeftRightIcon size={18} weight="bold" /> Tambah Transaksi
                </Button>
            </div>

            <div className="px-8 pb-10 w-full max-w-[1450px]">
                <div className="bg-white rounded-xl ring-1 ring-gray-950/5 shadow-sm overflow-hidden flex flex-col w-full">
                    <div className="flex justify-between items-center px-5 py-3 border-b border-gray-200 gap-4">
                        <div className="w-full sm:w-[320px]">
                            <Input 
                                placeholder="Cari transaksi..."
                                icon={<MagnifyingGlassIcon size={18} />}
                                value={search}
                                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                            />
                        </div>
                    </div>

                    <Table 
                        columns={columns}
                        data={transactions}
                        actions={[
                            { 
                                label: 'Edit', 
                                icon: <PencilSimpleIcon size={16} />, 
                                onClick: (row) => {
                                    setEditingRow(row);
                                    setNamaTransaksi(row.nama_transaksi);
                                    setType(row.jenis);
                                    setAmount(row.jumlah);
                                    setDate(row.tanggal);
                                    setWalletId(row.dompet_id);
                                    setCategoryId(row.kategori_id);
                                    setDescription(row.keterangan || '');
                                    setIsEditModalOpen(true);
                                }
                            },
                            { 
                                label: 'Delete', 
                                icon: <TrashIcon size={16} weight="bold" />, 
                                onClick: (row) => handleDelete(row.id),
                                variant: 'danger'
                            },
                        ]}
                    />

                    <div className="flex justify-between items-center px-5 py-3 border-t border-gray-100 bg-[#FAFAFA]/50">
                        <span className="text-[12px] text-gray-500 font-medium">
                            Halaman {pagination.current_page} dari {pagination.total_page} ({pagination.total_data} transaksi)
                        </span>
                        <div className="flex items-center gap-1.5">
                            <Button 
                                size="sm" variant="secondary" className="w-8 h-8 p-0"
                                disabled={page === 1}
                                onClick={() => setPage(page - 1)}
                            >
                                <CaretLeftIcon size={14} weight="bold" />
                            </Button>
                            <Button 
                                size="sm" variant="secondary" className="w-8 h-8 p-0"
                                disabled={page === pagination.total_page}
                                onClick={() => setPage(page + 1)}
                            >
                                <CaretRightIcon size={14} weight="bold" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal Tambah/Edit */}
            <Modal
                isOpen={isAddModalOpen || isEditModalOpen}
                onClose={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }}
                title={isEditModalOpen ? "Edit Transaksi" : "Tambah Transaksi"}
                size="lg"
                footer={
                    <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }}>Batal</Button>
                        <Button variant="primary" onClick={handleSave} disabled={loadingAction}>
                            {loadingAction ? 'Menyimpan...' : 'Simpan Transaksi'}
                        </Button>
                    </div>
                }
            >
                <form className="flex flex-col gap-5">
                    <Input label="Nama Transaksi" value={namaTransaksi} onChange={(e) => setNamaTransaksi(e.target.value)} required />
                    <div className="grid grid-cols-2 gap-4">
                        <Select label="Tipe" options={transactionTypes} value={type} onChange={setType} />
                        <Input label="Tanggal" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                    </div>
                    <Select label="Kategori" placeholder="Pilih kategori..." options={categories.filter(c => c.icon === (type === 'Pemasukan' ? TrendUpIcon : TrendDownIcon))} value={categoryId} onChange={setCategoryId} />
                    <Select label="Dompet" placeholder="Pilih sumber dana..." options={wallets} value={walletId} onChange={setWalletId} />
                    <Input label="Jumlah (Rp)" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />
                    <Input label="Deskripsi" type="textarea" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
                </form>
            </Modal>
        </>
    );
};

export default Transaksi;
