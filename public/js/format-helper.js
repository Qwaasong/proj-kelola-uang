// chart-utils.js

// Fungsi untuk format angka ke Rp + k/m/b
function formatNumber(num) {
    const n = Number(num);
    if (!isFinite(n)) return String(num);
    const abs = Math.abs(n);

    let formatted;
    if (abs >= 1_000_000_000) {
        formatted = (n / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'b';
    } else if (abs >= 1_000_000) {
        formatted = (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'm';
    } else if (abs >= 1_000) {
        formatted = (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'k';
    } else {
        formatted = String(n);
    }

    return 'Rp ' + formatted;
}

// Helper untuk merge opsi Chart.js supaya pakai formatNumber
function withFormattedAxes(chartJsOptions = {}) {
    // clone shallow supaya tidak mengubah object asal
    const opts = JSON.parse(JSON.stringify(chartJsOptions));

    // tooltip
    opts.plugins = opts.plugins || {};
    opts.plugins.tooltip = opts.plugins.tooltip || {};
    opts.plugins.tooltip.callbacks = opts.plugins.tooltip.callbacks || {};

    opts.plugins.tooltip.callbacks.label =
        opts.plugins.tooltip.callbacks.label ||
        function (context) {
            const parsed =
                (context.parsed && (context.parsed.y ?? context.parsed)) ??
                context.raw ??
                0;
            const label =
                context.dataset && context.dataset.label
                    ? context.dataset.label + ': '
                    : '';
            return label + formatNumber(parsed);
        };

    // ticks
    opts.scales = opts.scales || {};
    opts.scales.y = opts.scales.y || {};
    opts.scales.y.ticks = opts.scales.y.ticks || {};
    opts.scales.y.ticks.callback =
        opts.scales.y.ticks.callback ||
        function (value) {
            return formatNumber(value);
        };

    return opts;
}

// Biar bisa dipakai di file HTML lain
window.formatNumber = formatNumber;
window.withFormattedAxes = withFormattedAxes;
