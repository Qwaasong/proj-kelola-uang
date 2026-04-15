import Notify from 'simple-notify';
import 'simple-notify/dist/simple-notify.css';

/**
 * Utilitas Notifikasi menggunakan simple-notify
 * Menyediakan antarmuka yang mirip dengan toastr untuk kemudahan migrasi.
 */
const notify = {
    show: (status, title, text) => {
        return new Notify({
            status: status, // 'success', 'error', 'warning', 'info'
            title: title || status.charAt(0).toUpperCase() + status.slice(1),
            text: text,
            effect: 'slide',
            speed: 300,
            showIcon: true,
            showCloseButton: true,
            autoclose: true,
            autotimeout: 3000,
            position: 'right top',
            type: 'outline'
        });
    },

    success: (text, title = 'Berhasil') => notify.show('success', title, text),
    error: (text, title = 'Kesalahan') => notify.show('error', title, text),
    info: (text, title = 'Informasi') => notify.show('info', title, text),
    warning: (text, title = 'Peringatan') => notify.show('warning', title, text)
};

export default notify;
