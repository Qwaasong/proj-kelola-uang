/*
Fungsi global `createGraph` yang terintegrasi dengan Chart.js.
Mendukung:
- Lebih dari 1 nilai per label (mis. stacked bars atau multiple series per label)
- Input berupa `datasets` (Chart.js standard) atau `valuesPerLabel` (array of arrays)
- Reusable / global (terpasang di `window.createGraph`)
- Fungsi util untuk update / destroy

Cara pakai singkat (lihat tutorial di bawah untuk contoh lengkap):
1) Sertakan Chart.js lewat CDN di HTML:
   <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
2) Sertakan file JS ini sesudah Chart.js atau paste isinya ke <script> di halaman.
3) Panggil createGraph(canvasOrId, dataConfig, options)

================================================================================

EXPLAINER + FUNCTION API

createGraph(canvasOrId, dataConfig, options)
- canvasOrId: <canvas> DOM element atau string id ('myChart')
- dataConfig: {
    labels: ['Jan','Feb',...],
    // salah satu dari berikut:
    datasets: [ { label, data: [...], backgroundColor, borderColor, type, stack }, ... ]
    // OR (lebih mudah ketika "lebih dari 1 values per label")
    valuesPerLabel: [ [v11, v12, ...], [v21, v22,...], ... ]
      // bentuk: valuesPerLabel.length === labels.length
      // setiap inner array berisi nilai untuk semua series pada label y
    seriesLabels: ['A','B','C'] // optional (digunakan bila valuesPerLabel diberikan)
  }
- options: Chart.js options plus beberapa opsi tambahan:
    { type: 'bar'|'line'|'mixed', stacked: true|false, colors: optionalArray, responsive: true }

Return value: object { chart, destroy(), update(newConfig), addDataset(datasetObj) }

================================================================================

IMPLEMENTATION
*/

(function (global) {
    // Helper: generate colors
    function generateColor(i, alpha) {
        // simple palette that repeats if necessary
        const palette = [
            'rgba(31,119,180,', // blue
            'rgba(255,127,14,',  // orange
            'rgba(44,160,44,',   // green
            'rgba(214,39,40,',   // red
            'rgba(148,103,189,', // purple
            'rgba(140,86,75,',   // brown
            'rgba(227,119,194,', // pink
            'rgba(127,127,127,', // grey
            'rgba(188,189,34,',  // yellow-green
            'rgba(23,190,207,'   // cyan
        ];
        const c = palette[i % palette.length];
        return c + (alpha === undefined ? '1)' : (alpha + ')'));
    }

    function normalizeCanvas(canvasOrId) {
        let canvas = null;
        if (typeof canvasOrId === 'string') {
            canvas = document.getElementById(canvasOrId);
            if (!canvas) throw new Error("createGraph: tidak menemukan elemen canvas dengan id '" + canvasOrId + "'");
        } else if (canvasOrId instanceof HTMLCanvasElement) {
            canvas = canvasOrId;
        } else {
            // try to find canvas in DOM if user passed a context or node
            if (canvasOrId && canvasOrId.nodeType) {
                canvas = canvasOrId;
            } else {
                throw new Error('createGraph: canvasOrId harus string id atau elemen <canvas>');
            }
        }
        return canvas;
    }

    function buildDatasetsFromValuesPerLabel(valuesPerLabel, seriesLabels, colors, chartType, stacked) {
        // valuesPerLabel: [ [v11, v12, ...], [v21, v22, ...], ... ] where outer length == labels.length
        // transform to datasets per series: seriesCount = max inner length
        const labelsCount = valuesPerLabel.length;
        const seriesCount = valuesPerLabel.reduce((m, arr) => Math.max(m, (arr || []).length), 0);

        // initialize dataset arrays
        const datasets = [];
        for (let s = 0; s < seriesCount; s++) {
            datasets.push({
                label: (seriesLabels && seriesLabels[s]) ? seriesLabels[s] : (`Series ${s + 1}`),
                data: new Array(labelsCount).fill(null),
                backgroundColor: colors && colors[s] ? colors[s] : generateColor(s, 0.6),
                borderColor: colors && colors[s] ? colors[s] : generateColor(s, 1),
                borderWidth: 1,
                type: chartType || undefined,
                stack: stacked ? 'stack1' : undefined
            });
        }

        for (let i = 0; i < labelsCount; i++) {
            const vals = valuesPerLabel[i] || [];
            for (let s = 0; s < seriesCount; s++) {
                datasets[s].data[i] = (s < vals.length) ? vals[s] : null;
            }
        }
        return datasets;
    }

    function createGraph(canvasOrId, dataConfig = {}, options = {}) {
        if (typeof Chart === 'undefined') {
            throw new Error('createGraph: Chart.js tidak ditemukan. Sertakan Chart.js terlebih dahulu (CDN atau bundler).');
        }

        const canvas = normalizeCanvas(canvasOrId);
        // store chart instance on canvas to support reinit
        if (!canvas.__charts) canvas.__charts = {};

        // default options
        const opts = Object.assign({
            type: 'bar',
            stacked: false,
            responsive: true,
            colors: null
        }, options || {});

        const labels = dataConfig.labels || [];
        let datasets = dataConfig.datasets || null;

        if (!datasets && dataConfig.valuesPerLabel) {
            datasets = buildDatasetsFromValuesPerLabel(dataConfig.valuesPerLabel, dataConfig.seriesLabels || null, opts.colors, opts.type, opts.stacked);
        }

        // if datasets exist but some missing colors, fill them
        if (datasets && opts.colors) {
            for (let i = 0; i < datasets.length; i++) {
                if (!datasets[i].backgroundColor) datasets[i].backgroundColor = opts.colors[i] || generateColor(i, 0.6);
                if (!datasets[i].borderColor) datasets[i].borderColor = opts.colors[i] || generateColor(i, 1);
            }
        }

        const chartConfig = {
            type: opts.type === 'mixed' ? 'bar' : opts.type,
            data: {
                labels: labels,
                datasets: datasets || []
            },
            options: Object.assign({
                responsive: !!opts.responsive,
                interaction: { mode: 'index', intersect: false },
                plugins: { legend: { display: true } },
                scales: {
                    x: { stacked: !!opts.stacked },
                    y: { stacked: !!opts.stacked, beginAtZero: true }
                }
            }, opts.chartJsOptions || {})
        };

        // destroy existing chart on this canvas name (use options.name or default)
        const name = options.name || '_default';
        if (canvas.__charts[name]) {
            try { canvas.__charts[name].destroy(); } catch (e) { }
            delete canvas.__charts[name];
        }

        // create chart instance
        const chart = new Chart(canvas, chartConfig);
        canvas.__charts[name] = chart;

        function update(newConfig) {
            // newConfig can include labels, datasets, valuesPerLabel, seriesLabels, options
            if (newConfig.labels) chart.data.labels = newConfig.labels;
            if (newConfig.datasets) chart.data.datasets = newConfig.datasets;
            else if (newConfig.valuesPerLabel) chart.data.datasets = buildDatasetsFromValuesPerLabel(newConfig.valuesPerLabel, newConfig.seriesLabels || null, opts.colors, opts.type, opts.stacked);
            chart.update();
            return chart;
        }

        function addDataset(dataset) {
            chart.data.datasets.push(dataset);
            chart.update();
            return chart;
        }

        function destroy() {
            try { chart.destroy(); } catch (e) { }
            delete canvas.__charts[name];
        }

        return { chart, update, addDataset, destroy };
    }

    // expose globally
    global.createGraph = createGraph;

})(window);


/*
TUTORIAL SINGKAT & CONTOH

1) HTML

<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Contoh createGraph</title>
</head>
<body>
  <canvas id="myChart" width="600" height="300"></canvas>

  <!-- Chart.js CDN -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <!-- paste isi file createGraph_chartjs.js di sini atau include sebagai script -->
  <script src="createGraph_chartjs.js"></script>

  <script>
    // Contoh 1: Menggunakan datasets (standar Chart.js)
    const cfg1 = {
      labels: ['Jan','Feb','Mar','Apr'],
      datasets: [
        { label: 'A', data: [10,20,30,15], backgroundColor: 'rgba(31,119,180,0.6)' },
        { label: 'B', data: [5,25,15,10], backgroundColor: 'rgba(255,127,14,0.6)' }
      ]
    };
    const g1 = createGraph('myChart', cfg1, { type: 'bar', stacked: false });

    // Contoh 2: valuesPerLabel -> tiap label punya lebih dari 1 value
    // valuesPerLabel bentuk: [ [v1_for_series1, v1_for_series2], [v2_s1, v2_s2], ... ]
    const cfg2 = {
      labels: ['Label 1','Label 2','Label 3'],
      valuesPerLabel: [ [10,7,3], [5,2,1], [8,6,4] ],
      seriesLabels: ['Cat A','Cat B','Cat C']
    };
    // createGraph akan otomatis membalik menjadi datasets per series
    // (3 series karena setiap inner array punya 3 nilai)

    // contoh pemanggilan lain, stacked bars:
    // const g2 = createGraph('myChart', cfg2, { type: 'bar', stacked: true });

    // Update data nanti: g1.update({ labels: [...], datasets: [...] })
    // Destroy: g1.destroy()

  </script>
</body>
</html>

TIPS:
- Jika ingin chart campuran (line + bar), gunakan dataset.type = 'line' untuk tiap dataset yang ingin menjadi line.
- Atur options Chart.js lewat parameter `options.chartJsOptions` saat memanggil createGraph.
- Function di atas melekat ke `window.createGraph`, sehingga dapat dipanggil dari mana saja di aplikasi web Anda.
*/
