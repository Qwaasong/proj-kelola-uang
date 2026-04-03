import { useLocation, Link } from 'react-router-dom';

/**
 * Komponen Breadcrumbs
 * Menampilkan hirarki navigasi berdasarkan URL saat ini.
 */
const BreadCrumbs = () => {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter((x) => x);

    // Pemetaan nama rute ke label yang lebih manusiawi
    const routeLabels = {
        'dashboard': 'Dashboard',
        'transaksi': 'Transaksi',
        'dompet': 'Dompet',
        'dana-darurat': 'Dana Darurat',
        'laporan': 'Laporan',
    };

    return (
        <nav className="flex text-sm font-medium" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-2">
                {/* Root / Home */}
                <li className="inline-flex items-center">
                    <Link 
                        to="/dashboard" 
                        className="text-gray-500 hover:text-primary transition-colors"
                    >
                        Beranda
                    </Link>
                </li>

                {pathnames.map((value, index) => {
                    const last = index === pathnames.length - 1;
                    const to = `/${pathnames.slice(0, index + 1).join('/')}`;
                    const label = routeLabels[value] || value.charAt(0).toUpperCase() + value.slice(1);

                    return (
                        <li key={to} className="flex items-center">
                            <span className="mx-2 text-gray-300 font-normal">/</span>
                            {last ? (
                                <span className="text-secondary font-bold">
                                    {label}
                                </span>
                            ) : (
                                <Link 
                                    to={to} 
                                    className="text-gray-500 hover:text-primary transition-colors"
                                >
                                    {label}
                                </Link>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
};

export default BreadCrumbs;
