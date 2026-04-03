import BreadCrumbs from './BreadCrumbs';

/**
 * Komponen TopHeader
 * Menampilkan baris navigasi atas (Breadcrumbs) dengan pemisah border bottom.
 */
const TopHeader = () => {
    return (
        <header className="
            flex-shrink-0 w-full h-14 px-8 
            flex items-center 
            bg-[#F5F7F6] 
            border-b-2 border-gray-200
        ">
            <BreadCrumbs />
        </header>
    );
};

export default TopHeader;
