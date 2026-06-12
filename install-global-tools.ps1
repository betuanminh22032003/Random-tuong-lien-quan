# =============================================================================
# Claude Code Global Token-Saving Tools Installer
# Tools: RTK, Caveman, GitNexus, GSD
# Chạy bằng PowerShell với quyền Admin: .\install-global-tools.ps1
# =============================================================================

$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

function Write-Step { param($msg) Write-Host "`n==> $msg" -ForegroundColor Cyan }
function Write-OK   { param($msg) Write-Host "    [OK] $msg" -ForegroundColor Green }
function Write-Warn { param($msg) Write-Host "    [!]  $msg" -ForegroundColor Yellow }
function Write-Fail { param($msg) Write-Host "    [X]  $msg" -ForegroundColor Red }

Write-Host "`n Claude Code Global Token-Saving Tools" -ForegroundColor Magenta
Write-Host " RTK (60-90%) + Caveman (65%) + GitNexus + GSD`n" -ForegroundColor DarkGray

# ─── 1. CAVEMAN ──────────────────────────────────────────────────────────────
Write-Step "1/4  Caveman — output token compression (~65% savings)"
Write-Host "     github.com/JuliusBrussee/caveman (62k stars)"
try {
    # Caveman có installer PowerShell chính thức
    Invoke-Expression (Invoke-RestMethod "https://raw.githubusercontent.com/JuliusBrussee/caveman/main/install.ps1")
    Write-OK "Caveman installed. Trigger: gõ /caveman trong Claude Code"
} catch {
    Write-Fail "Caveman install failed: $_"
    Write-Warn "Manual: irm https://raw.githubusercontent.com/JuliusBrussee/caveman/main/install.ps1 | iex"
}

# ─── 2. GITNEXUS ─────────────────────────────────────────────────────────────
Write-Step "2/4  GitNexus — codebase knowledge graph (giảm file reads ~99%)"
Write-Host "     github.com/abhigyanpatwari/GitNexus"
try {
    # Check node
    $null = Get-Command node -ErrorAction Stop
    npm install -g gitnexus 2>&1 | Out-Null
    Write-OK "GitNexus installed globally"
    Write-Host "     Tiếp theo: cd vào project -> npx gitnexus analyze" -ForegroundColor DarkGray
    Write-Host "     Hoặc: gitnexus setup  (auto-detect editor config)" -ForegroundColor DarkGray
} catch {
    if ($_.Exception.Message -like "*Get-Command*") {
        Write-Fail "Node.js không tìm thấy. Cài Node 18+ từ nodejs.org trước."
    } else {
        Write-Fail "GitNexus install failed: $_"
    }
}

# ─── 3. GSD ──────────────────────────────────────────────────────────────────
Write-Step "3/4  GSD (Get Shit Done) — spec-driven workflow system"
Write-Host "     github.com/gsd-build/get-shit-done"
try {
    $null = Get-Command node -ErrorAction Stop
    # Install global cho Claude Code
    npx get-shit-done-cc --claude --global 2>&1
    Write-OK "GSD installed globally (~/.claude/)"
    Write-Host "     Dùng: /gsd, /gsd-plan, /gsd-build trong Claude Code" -ForegroundColor DarkGray
} catch {
    Write-Fail "GSD install failed: $_"
    Write-Warn "Manual: npx get-shit-done-cc --claude --global"
}

# ─── 4. RTK ──────────────────────────────────────────────────────────────────
Write-Step "4/4  RTK (mcp-rtk) — MCP proxy, compresses tool responses 60-90%"
Write-Host "     github.com/ThomasTartrau/mcp-rtk | crates.io/crates/mcp-rtk"

$cargoOk = $false
try {
    $null = Get-Command cargo -ErrorAction Stop
    $cargoOk = $true
} catch {}

if ($cargoOk) {
    try {
        cargo install mcp-rtk 2>&1 | Select-String "Installed|Compiling" | Write-Host
        Write-OK "mcp-rtk installed via cargo"
        Write-Host ""
        Write-Host "     Cách dùng RTK trong ~/.claude.json:" -ForegroundColor DarkGray
        Write-Host '     Bọc MCP server bằng "mcp-rtk --": ' -ForegroundColor DarkGray
        Write-Host '       "command": "mcp-rtk",' -ForegroundColor DarkGray
        Write-Host '       "args": ["--", "npx", "-y", "@ten/mcp-server"]' -ForegroundColor DarkGray
        Write-Host "     Hoặc auto-wrap tất cả: mcp-rtk install ~/.claude.json" -ForegroundColor DarkGray
    } catch {
        Write-Fail "cargo install failed: $_"
    }
} else {
    Write-Warn "Rust/Cargo chưa cài. RTK cần Cargo để build."
    Write-Host ""
    Write-Host "     Option A — Cài Rust (khuyến nghị):" -ForegroundColor Yellow
    Write-Host "       irm https://win.rustup.rs/x86_64 -OutFile rustup-init.exe" -ForegroundColor DarkGray
    Write-Host "       .\rustup-init.exe -y" -ForegroundColor DarkGray
    Write-Host "       # Mở terminal mới, rồi: cargo install mcp-rtk" -ForegroundColor DarkGray
    Write-Host ""
    Write-Host "     Option B — Dùng alternative (caveman-shrink, npm):" -ForegroundColor Yellow
    Write-Host "       npm install -g caveman-shrink" -ForegroundColor DarkGray
    Write-Host "       # Tương tự RTK nhưng dựa trên Node.js" -ForegroundColor DarkGray
}

# ─── SUMMARY ─────────────────────────────────────────────────────────────────
Write-Host "`n============================================" -ForegroundColor Magenta
Write-Host " SETUP XONG — Tóm tắt tiết kiệm token" -ForegroundColor Magenta
Write-Host "============================================" -ForegroundColor Magenta
Write-Host ""
Write-Host " Tool        Savings  Cách dùng"
Write-Host " ─────────────────────────────────────────"
Write-Host " Caveman      ~65%    /caveman trong Claude Code"
Write-Host " GitNexus     ~99%*   gitnexus analyze (trong project)"
Write-Host " GSD          struct  /gsd-plan, /gsd-build"
Write-Host " RTK          60-90%  mcp-rtk install ~/.claude.json"
Write-Host ""
Write-Host " * File reads thay bằng knowledge graph query"
Write-Host ""
Write-Host " Recommended workflow:" -ForegroundColor Cyan
Write-Host "   1. cd vào project, chạy: gitnexus analyze"
Write-Host "   2. Mở Claude Code, gõ: /caveman"
Write-Host "   3. Dùng /gsd khi cần structured planning"
Write-Host "   4. Wrap MCPs bằng RTK: mcp-rtk install ~/.claude.json"
Write-Host ""
