<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pemasukan Berulang | Kelola Uang</title>
    <link rel="stylesheet" href="css/transaction-style.css">
</head>

<body>

    <header class="header">
        <img src="asset/Logo-Icons.png" alt="Kelola Uang Logo" class="header__logo">
    </header>

    <main class="main-content">
        <div class="add-container">
            <h2 class="add-container__title">Tambah Pemasukan Berulang</h2>
            <form action="#" class="add-form">
                <div class="form-group">
                    <label for="income-date" class="form-label">Tanggal</label>
                    <input type="date" id="income-date" class="form-input date-input" required>
                </div>
                <div class="form-group">
                    <label for="income-category" class="form-label">Kategori</label>
                    <input type="text" id="income-category" class="form-input" required>
                </div>
                <div class="form-group">
                    <label for="income-amount" class="form-label">Jumlah Pemasukan</label>
                    <input type="number" id="income-amount" class="form-input" required>
                </div>
                <div class="form-group textarea-group">
                    <label for="income-description" class="form-label">Deskripsi</label>
                    <textarea id="income-description" class="form-input" rows="4"></textarea>
                </div>
                <div class="form-group button-group">
                    <button type="submit" class="submit-btn">Simpan</button>
                </div>
            </form>
        </div>
        <div class="history-container">
            <div class="history-container__header">
                <h2 class="history-container__title">Riwayat Pemasukan</h2>
            </div>
            <div class="history-container__list">
                <div class="query-container">
                    <select class="query-select__limit">
                        <option value="">5</option>
                        <option value="">10</option>
                        <option value="">15</option>
                        <option value="">20</option>
                    </select>

                    <div class="query-search__text">
                        <input type="text" class="query-search__input" placeholder="Cari...">
                        <button class="query-search__btn">Cari</button>
                    </div>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Tanggal</th>
                            <th>Jumlah</th>
                            <th>Kategori</th>
                            <th>Deskripsi</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>2023-10-01</td>
                            <td>Rp 1.000.000</td>
                            <td>Gaji</td>
                            <td>Penerimaan gaji bulanan</td>
                        </tr>
                    </tbody>
                </table>
                <div class="mobile-history__list">
                    <div class="mobile-history__card">
                        <div class="mobile-history__info">
                            <h2 class="mobile-history__date">4 Agustus 2025</h2>
                            <p class="mobile-history__category">Gaji</p>
                        </div>
                        <h2 class="mobile-history__value">Rp 5.000.000</h2>
                    </div>
                </div>
                <div class="history-container__pagination">
                    <button class="pagination-btn">1</button>
                    <button class="pagination-btn">2</button>
                    <button class="pagination-btn">3</button>
                </div>
            </div>
        </div>
        <div class="back-container">
            <a href="/dashboard" class="back-btn__link">Kembali ke Beranda</a>
        </div>
    </main>

    <script>
        // Membuat seluruh input tanggal bisa diklik
        document.addEventListener('DOMContentLoaded', function () {
            const dateInput = document.getElementById('income-date');

            if (dateInput) {
                // Fungsi untuk membuka date picker dengan penanganan error
                function openDatePicker() {
                    try {
                        // Untuk browser yang mendukung showPicker
                        if (typeof this !== 'undefined' && this.showPicker) {
                            this.showPicker();
                        } else {
                            // Fallback untuk browser yang tidak mendukung
                            this.focus();
                            this.click();
                        }
                    } catch (e) {
                        // Fallback jika terjadi error
                        this.focus();
                    }
                }

                dateInput.addEventListener('click', openDatePicker);

                // Juga memastikan fokus bekerja dengan baik
                dateInput.addEventListener('focus', function () {
                    // Memberikan sedikit delay agar fokus bekerja dengan baik
                    setTimeout(() => {
                        try {
                            if (typeof this !== 'undefined' && this.showPicker) {
                                this.showPicker();
                            }
                        } catch (e) {
                            // Tidak melakukan apa-apa jika terjadi error
                        }
                    }, 10);
                });
            }
        });
    </script>
</body>

</html>