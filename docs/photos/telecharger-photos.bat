@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo Téléchargement des photos depuis Wikimedia Commons...
node telecharger-photos.mjs
echo.
echo Terminé. Ouvrez apercu.html pour vérifier les photos.
pause
