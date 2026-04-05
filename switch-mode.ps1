<#
.SYNOPSIS
    Switch antara mode Development dan Production untuk aplikasi Uangmu.

.DESCRIPTION
    Script ini mengubah konfigurasi .env backend dan menampilkan instruksi
    untuk menjalankan aplikasi di mode yang dipilih.

.PARAMETER Mode
    Mode yang diinginkan: 'dev' atau 'prod'

.EXAMPLE
    .\switch-mode.ps1 dev
    .\switch-mode.ps1 prod
#>

param(
    [Parameter(Position=0)]
    [ValidateSet('dev', 'prod', 'development', 'production', 'status')]
    [string]$Mode
)

$rootDir = $PSScriptRoot
$envFile = Join-Path $rootDir ".env"
$envDev  = Join-Path $rootDir ".env.development"
$envProd = Join-Path $rootDir ".env.production"

# ====== STYLING FUNCTIONS ======
function Write-Title {
    param([string]$text)
    Write-Host ""
    Write-Host "  ======================================================" -ForegroundColor Cyan
    Write-Host "    $text" -ForegroundColor Cyan
    Write-Host "  ======================================================" -ForegroundColor Cyan
    Write-Host ""
}

function Write-Step {
    param([string]$icon, [string]$text)
    Write-Host "  $icon " -ForegroundColor Yellow -NoNewline
    Write-Host $text
}

function Write-Ok {
    param([string]$text)
    Write-Host "  [OK] $text" -ForegroundColor Green
}

function Write-InfoMsg {
    param([string]$text)
    Write-Host "  [INFO] $text" -ForegroundColor Gray
}

function Write-WarnMsg {
    param([string]$text)
    Write-Host "  [WARN] $text" -ForegroundColor Yellow
}

# ====== DETEKSI MODE SAAT INI ======
function Get-CurrentMode {
    if (Test-Path $envFile) {
        $content = Get-Content $envFile -Raw
        if ($content -match 'APP_ENV=(\S+)') {
            return $matches[1]
        }
    }
    return "unknown"
}

# ====== TAMPILKAN STATUS ======
function Show-Status {
    $current = Get-CurrentMode
    Write-Title "UANGMU - Status Mode Saat Ini"
    
    if ($current -eq "development") {
        Write-Host "  >>> Mode aktif: DEVELOPMENT <<<" -ForegroundColor Green
    }
    elseif ($current -eq "production") {
        Write-Host "  >>> Mode aktif: PRODUCTION <<<" -ForegroundColor Red
    }
    else {
        Write-Host "  >>> Mode aktif: TIDAK DIKETAHUI <<<" -ForegroundColor Gray
    }
    
    Write-Host ""
    Write-Host "  Gunakan:" -ForegroundColor White
    Write-Host "    .\switch-mode.ps1 dev   -> beralih ke Development" -ForegroundColor Cyan
    Write-Host "    .\switch-mode.ps1 prod  -> beralih ke Production" -ForegroundColor Cyan
    Write-Host ""
}

# ====== SWITCH KE DEVELOPMENT ======
function Switch-ToDev {
    $current = Get-CurrentMode
    
    Write-Title "BERALIH KE MODE DEVELOPMENT"
    
    if ($current -eq "development") {
        Write-WarnMsg "Sudah dalam mode DEVELOPMENT!"
        Write-Host ""
        return
    }
    
    # Copy .env.development ke .env
    if (Test-Path $envDev) {
        Copy-Item $envDev $envFile -Force
        Write-Ok ".env telah diubah ke mode DEVELOPMENT"
    }
    else {
        Write-WarnMsg "File .env.development tidak ditemukan! Membuat dari template..."
        $devContent = @"
APP_ENV=development
APP_DEBUG=true
APP_URL=http://localhost

DB_HOST=localhost
DB_NAME=uangmu_app_db
DB_USER=root
DB_PASS=

API_BASE_PATH=/proj-kelola-uang/api
ALLOWED_ORIGIN=*
"@
        $devContent | Set-Content $envFile -Encoding UTF8
        Write-Ok ".env telah dibuat dengan konfigurasi development"
    }
    
    Write-Host ""
    Write-Host "  Konfigurasi Development:" -ForegroundColor DarkCyan
    Write-Host "  ------------------------------------------------" -ForegroundColor DarkCyan
    Write-Host "    APP_ENV      = development" -ForegroundColor DarkCyan
    Write-Host "    APP_DEBUG    = true" -ForegroundColor DarkCyan
    Write-Host "    API_BASE     = /proj-kelola-uang/api" -ForegroundColor DarkCyan
    Write-Host "    Vite Proxy   = aktif (-> XAMPP)" -ForegroundColor DarkCyan
    Write-Host "  ------------------------------------------------" -ForegroundColor DarkCyan
    Write-Host ""
    Write-Host "  Cara menjalankan:" -ForegroundColor White
    Write-Step "1." "Pastikan XAMPP (Apache + MySQL) sudah berjalan"
    Write-Step "2." "Masuk ke folder frontend: cd frontend"
    Write-Step "3." "Jalankan dev server:      npm run dev"
    Write-Step "4." "Buka browser:             http://localhost:5173"
    Write-Host ""
    Write-InfoMsg "Vite akan mem-proxy /api/* ke XAMPP secara otomatis"
    Write-Host ""
}

# ====== SWITCH KE PRODUCTION ======
function Switch-ToProd {
    $current = Get-CurrentMode
    
    Write-Title "BERALIH KE MODE PRODUCTION"
    
    if ($current -eq "production") {
        Write-WarnMsg "Sudah dalam mode PRODUCTION!"
        Write-Host ""
        return
    }
    
    # Copy .env.production ke .env
    if (Test-Path $envProd) {
        Copy-Item $envProd $envFile -Force
        Write-Ok ".env telah diubah ke mode PRODUCTION"
    }
    else {
        Write-WarnMsg "File .env.production tidak ditemukan! Membuat dari template..."
        $prodContent = @"
APP_ENV=production
APP_DEBUG=false
APP_URL=http://localhost

DB_HOST=localhost
DB_NAME=uangmu_app_db
DB_USER=root
DB_PASS=

API_BASE_PATH=/api
ALLOWED_ORIGIN=*
"@
        $prodContent | Set-Content $envFile -Encoding UTF8
        Write-Ok ".env telah dibuat dengan konfigurasi production"
    }
    
    Write-Host ""
    Write-Host "  Konfigurasi Production:" -ForegroundColor DarkMagenta
    Write-Host "  ------------------------------------------------" -ForegroundColor DarkMagenta
    Write-Host "    APP_ENV      = production" -ForegroundColor DarkMagenta
    Write-Host "    APP_DEBUG    = false" -ForegroundColor DarkMagenta
    Write-Host "    API_BASE     = /api" -ForegroundColor DarkMagenta
    Write-Host "    Vite Proxy   = nonaktif" -ForegroundColor DarkMagenta
    Write-Host "  ------------------------------------------------" -ForegroundColor DarkMagenta
    Write-Host ""
    Write-Host "  Langkah deploy production:" -ForegroundColor White
    Write-Step "1." "cd frontend && npm run build"
    Write-Step "2." "Salin isi frontend/dist/* ke folder public/"
    Write-Step "3." "Upload seluruh project ke hosting"
    Write-Step "4." "Sesuaikan DB_HOST, DB_USER, DB_PASS di .env"
    Write-Host ""
    Write-InfoMsg "Pastikan ALLOWED_ORIGIN diatur ke domain Anda di production!"
    Write-Host ""
}

# ====== MAIN ======
if (-not $Mode) {
    # Jika tanpa parameter, tampilkan status + menu interaktif
    Show-Status
    Write-Host "  Pilih mode:" -ForegroundColor White
    Write-Host "    [1] Development (untuk coding lokal)" -ForegroundColor Cyan
    Write-Host "    [2] Production  (untuk deploy/hosting)" -ForegroundColor Magenta
    Write-Host "    [0] Batal" -ForegroundColor Gray
    Write-Host ""
    $choice = Read-Host "  Pilihan Anda"
    
    switch ($choice) {
        "1" { Switch-ToDev }
        "2" { Switch-ToProd }
        "0" { 
            Write-Host "  Dibatalkan." -ForegroundColor Gray
            Write-Host "" 
        }
        default { 
            Write-Host "  Pilihan tidak valid." -ForegroundColor Red
            Write-Host "" 
        }
    }
}
else {
    switch ($Mode) {
        { $_ -in 'dev', 'development' } { Switch-ToDev }
        { $_ -in 'prod', 'production' } { Switch-ToProd }
        'status' { Show-Status }
    }
}
