Write-Host "Portable OUDL builder"
npm install 
npm run dist -- --win portable 
Set-Location -Path dist/win-unpacked
Start-Process -FilePath "OUDL.exe"
cd ..
cd ..
Write-Host "DONE"
