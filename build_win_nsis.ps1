Write-Host "NSIS OUDL Installer builder"
npm install 
npm run dist -- --win nsis
Set-Location -Path dist
Start-Process -FilePath "OUDL Setup 1.0.0.exe"
cd ..
Write-Host "DONE"
