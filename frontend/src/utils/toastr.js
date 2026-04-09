import toastr from 'toastr';
import 'toastr/build/toastr.min.css';

// Konfigurasi Global Toastr
toastr.options = {
  "closeButton": true,
  "debug": false,
  "newestOnTop": true,
  "progressBar": true,
  "positionClass": "toast-top-right",
  "preventDuplicates": false,
  "onclick": null,
  
  // Menggunakan animasi CSS kustom (slideBounceIn & slideOutRight)
  // Kita matikan efek bawaan jQuery agar tidak konflik
  "showDuration": "300",
  "hideDuration": "1000",
  "timeOut": "5000",
  "extendedTimeOut": "1000",
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "fadeIn", // Kita tetap pakai fadeIn/fadeOut tapi CSS akan menimpanya
  "hideMethod": "fadeOut"
};

export default toastr;
