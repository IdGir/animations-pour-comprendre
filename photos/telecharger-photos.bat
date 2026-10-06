@echo off
cd /d "%~dp0"
echo ==========================================================
echo  Telechargement des photos (Wikimedia Commons)
echo  Dossier : %CD%
echo ==========================================================
where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo ERREUR : Node.js n'est pas installe.
  echo Installez-le : https://nodejs.org  (bouton LTS^), puis FERMEZ cette fenetre
  echo et relancez ce fichier.
  echo.
  pause
  exit /b 1
)
for /f "delims=" %%v in ('node -v') do set NV=%%v
echo Node.js detecte : %NV%
echo.
node telecharger-photos.mjs > journal.txt 2>&1
type journal.txt
echo.
echo ==========================================================
echo  Termine. Le detail est dans le fichier journal.txt
echo  Photos recuperees : ouvrez apercu.html pour les verifier.
echo ==========================================================
pause
