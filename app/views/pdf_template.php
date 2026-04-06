<!DOCTYPE html>
<html lang="id">
<head>
    <style>
        /* 1. TIPOGRAFI & WARNA DASAR */
        body { 
            font-family: 'Inter', 'Arial', sans-serif; 
            font-size: 9.5pt; 
            color: #1F2937; 
            background-color: #FFFFFF;
            line-height: 1.5;
        }

        .text-secondary { color: #6B7280; font-size: 9pt; }
        .text-accent { color: #0D9488; }
        
        /* Utilitas Teks */
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        .font-bold { font-weight: bold; }

        /* 2. LAYOUT HEADER & JUDUL */
        .header-section { margin-bottom: 30px; }
        .report-title { 
            font-size: 20pt; 
            font-weight: bold; 
            color: #0D9488; 
            margin: 0 0 5px 0;
        }
        
        .section-title { 
            font-size: 11pt; 
            font-weight: bold; 
            color: #1F2937; 
            margin-top: 30px; 
            margin-bottom: 12px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        /* 3. ELEMEN KARTU RINGKASAN */
        .card-container { width: 100%; border-collapse: separate; border-spacing: 12px 0; margin-bottom: 25px; margin-left: -12px; }
        .card { 
            width: 33.33%; 
            border: 1px solid #E5E7EB; 
            border-radius: 8px; 
            padding: 15px; 
        }
        .card-label { 
            font-size: 8pt; 
            color: #6B7280; 
            text-transform: uppercase; 
            margin-bottom: 4px; 
            font-weight: bold;
        }
        .card-value { 
            font-size: 14pt; 
            font-weight: bold; 
        }

        /* 4. STYLING TABEL */
        .clean-table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-bottom: 25px; 
            table-layout: fixed; 
        }
        
        .clean-table th { 
            background-color: #F9FAFB; 
            color: #4B5563; 
            font-size: 8pt; 
            text-transform: uppercase; 
            font-weight: bold; 
            padding: 10px; 
            text-align: left; 
            border-bottom: 2px solid #D1D5DB; 
        }
        
        .clean-table td { 
            padding: 12px 10px; 
            color: #374151; 
            font-weight: normal; 
            border-bottom: 1px solid #D1D5DB; 
            vertical-align: middle;
            white-space: nowrap; 
            overflow: hidden;
        }

        /* Status Colors */
        .in { color: #059669; }
        .out { color: #DC2626; }
        .sav { color: #2563EB; }
        .capitalize { text-transform: capitalize; }

    </style>
</head>
<body>

    <div class="header-section">
        <h1 class="report-title">Laporan Keuangan</h1>
        <div class="text-secondary">Periode: <?= date('d M Y', strtotime($startDate)) ?> &mdash; <?= date('d M Y', strtotime($endDate)) ?></div>
    </div>

    <table class="card-container">
        <tr>
            <td class="card">
                <div class="card-label">Pemasukan</div>
                <div class="card-value in">Rp <?= number_format($totalPemasukan, 0, ',', '.') ?></div>
            </td>
            <td class="card">
                <div class="card-label">Pengeluaran</div>
                <div class="card-value out">Rp <?= number_format($totalPengeluaran, 0, ',', '.') ?></div>
            </td>
            <td class="card">
                <div class="card-label">Saldo Aset</div>
                <div class="card-value text-accent">Rp <?= number_format($totalSaldoDompet, 0, ',', '.') ?></div>
            </td>
        </tr>
    </table>

    <div class="section-title">Daftar Akun & Dompet</div>
    <table class="clean-table">
        <thead>
            <tr>
                <th width="70%">Nama Akun</th>
                <th width="30%" class="text-right">Saldo Terkini</th>
            </tr>
        </thead>
        <tbody>
            <?php foreach($dompetData as $d): ?>
            <tr>
                <td><?= htmlspecialchars($d['nama_dompet']) ?></td>
                <td class="text-right">Rp <?= number_format($d['saldo'], 0, ',', '.') ?></td>
            </tr>
            <?php endforeach; ?>
            <?php if(empty($dompetData)): ?>
                <tr><td colspan="2" class="text-center text-secondary">Tidak ada data dompet.</td></tr>
            <?php endif; ?>
        </tbody>
    </table>

    <div class="section-title">Dana Darurat</div>
    <table class="clean-table">
        <thead>
            <tr>
                <th width="40%">Keterangan Alokasi</th>
                <th width="30%" class="text-right">Terkumpul</th>
                <th width="30%" class="text-right">Target Maksimal</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Simpanan Dana Darurat</td>
                <td class="text-right in">Rp <?= number_format($danaDarurat['jumlah_terkumpul'] ?? 0, 0, ',', '.') ?></td>
                <td class="text-right text-secondary">Rp <?= number_format($danaDarurat['jumlah_target'] ?? 0, 0, ',', '.') ?></td>
            </tr>
        </tbody>
    </table>

    <div class="section-title">Target Finansial</div>
    <table class="clean-table">
        <thead>
            <tr>
                <th width="40%">Nama Goal</th>
                <th width="25%" class="text-right">Terkumpul</th>
                <th width="25%" class="text-right">Target</th>
                <th width="10%" class="text-right">Progres</th>
            </tr>
        </thead>
        <tbody>
            <?php foreach($goalsData as $g): 
                $persen = ($g['jumlah_target'] > 0) ? ($g['terkumpul'] / $g['jumlah_target']) * 100 : 0;
            ?>
            <tr>
                <td><?= htmlspecialchars($g['nama_target']) ?></td>
                <td class="text-right in">Rp <?= number_format($g['terkumpul'], 0, ',', '.') ?></td>
                <td class="text-right text-secondary">Rp <?= number_format($g['jumlah_target'], 0, ',', '.') ?></td>
                <td class="text-right"><?= number_format($persen, 0) ?>%</td>
            </tr>
            <?php endforeach; ?>
            <?php if(empty($goalsData)): ?>
                <tr><td colspan="4" class="text-center text-secondary">Belum ada target finansial.</td></tr>
            <?php endif; ?>
        </tbody>
    </table>

    <pagebreak />

    <div class="section-title">Riwayat Transaksi</div>
    <table class="clean-table">
        <thead>
            <tr>
                <th width="12%">Tanggal</th>
                <th width="18%">Kategori</th>
                <th width="15%">Dompet</th>
                <th width="25%">Keterangan</th>
                <th width="12%" class="text-center">Tipe</th>
                <th width="18%" class="text-right">Nominal</th>
            </tr>
        </thead>
        <tbody>
            <?php foreach($transaksiData as $t): 
                $typeClass = ($t['jenis'] === 'Pemasukan') ? 'in' : (($t['jenis'] === 'Pengeluaran') ? 'out' : 'sav');
            ?>
            <tr>
                <td class="text-secondary"><?= date('d/m/y', strtotime($t['tanggal'])) ?></td>
                <td><?= htmlspecialchars($t['nama_kategori'] ?? 'Tabungan') ?></td>
                <td class="text-secondary"><?= htmlspecialchars($t['nama_dompet'] ?? '-') ?></td>
                <td class="text-secondary"><?= htmlspecialchars($t['keterangan'] ?? '-') ?></td>
                <td class="text-center <?= $typeClass ?> capitalize"><?= strtolower($t['jenis']) ?></td>
                <td class="text-right <?= $typeClass ?>">Rp <?= number_format($t['jumlah'], 0, ',', '.') ?></td>
            </tr>
            <?php endforeach; ?>
            <?php if(empty($transaksiData)): ?>
                <tr><td colspan="6" class="text-center text-secondary">Tidak ada transaksi pada periode ini.</td></tr>
            <?php endif; ?>
        </tbody>
    </table>

</body>
</html>
