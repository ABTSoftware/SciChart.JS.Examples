# Firebase Installation and Dependency Resolution Script
# This script installs Firebase and resolves any dependency conflicts

Write-Host "🔥 Installing Firebase and resolving dependencies..." -ForegroundColor Green

# Check if npm is available
try {
    $npmVersion = npm --version
    Write-Host "✅ npm version: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm not found. Please install Node.js and npm first." -ForegroundColor Red
    exit 1
}

# Check if Firebase is already installed
$firebaseInstalled = npm list firebase 2>$null
if ($firebaseInstalled -and $firebaseInstalled -notlike "*empty*") {
    Write-Host "✅ Firebase is already installed" -ForegroundColor Green
} else {
    Write-Host "📦 Installing Firebase..." -ForegroundColor Yellow
    
    # Install Firebase
    npm install firebase@^10.7.1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Firebase installed successfully" -ForegroundColor Green
    } else {
        Write-Host "❌ Failed to install Firebase" -ForegroundColor Red
        exit 1
    }
}

# Check for dependency conflicts
Write-Host "🔍 Checking for dependency conflicts..." -ForegroundColor Yellow
npm audit --audit-level moderate

# Install any missing peer dependencies
Write-Host "📦 Installing peer dependencies..." -ForegroundColor Yellow
npm install

# Verify Firebase installation
Write-Host "🔍 Verifying Firebase installation..." -ForegroundColor Yellow
$firebaseCheck = npm list firebase 2>$null
if ($firebaseCheck -and $firebaseCheck -notlike "*empty*") {
    Write-Host "✅ Firebase verification successful" -ForegroundColor Green
    Write-Host "📋 Firebase version: $(npm list firebase --depth=0 | Select-String 'firebase@')" -ForegroundColor Cyan
} else {
    Write-Host "❌ Firebase verification failed" -ForegroundColor Red
    exit 1
}

# Check for TypeScript compatibility
Write-Host "🔍 Checking TypeScript compatibility..." -ForegroundColor Yellow
$tsCheck = npm list typescript 2>$null
if ($tsCheck -and $tsCheck -notlike "*empty*") {
    Write-Host "✅ TypeScript is available" -ForegroundColor Green
} else {
    Write-Host "⚠️  TypeScript not found, but Firebase should still work" -ForegroundColor Yellow
}

# Check for React compatibility
Write-Host "🔍 Checking React compatibility..." -ForegroundColor Yellow
$reactCheck = npm list react 2>$null
if ($reactCheck -and $reactCheck -notlike "*empty*") {
    Write-Host "✅ React is available" -ForegroundColor Green
} else {
    Write-Host "⚠️  React not found, but Firebase should still work" -ForegroundColor Yellow
}

Write-Host "🎉 Firebase installation and dependency resolution complete!" -ForegroundColor Green
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "   1. Update your .env file with Firebase credentials" -ForegroundColor White
Write-Host "   2. Run: python setup_firebase.py" -ForegroundColor White
Write-Host "   3. Start your development server: npm run dev:clean" -ForegroundColor White 