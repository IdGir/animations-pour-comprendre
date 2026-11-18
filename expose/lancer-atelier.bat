@echo off
chcp 65001 >nul
title Atelier Exposes
cd /d "%~dp0"
if not exist "%~dp0serveur-atelier.mjs" goto pasdefichier
where node >nul 2>nul
if errorlevel 1 goto pasdenode
echo.
echo  Atelier Exposes : demarrage du serveur...
echo  NE FERMEZ PAS cette fenetre pendant la seance.
echo.
node "%~dp0serveur-atelier.mjs"
echo.
echo  Le serveur s'est arrete. Si un message d'erreur est affiche ci-dessus, notez-le.
pause
exit /b

:pasdenode
echo.
echo  Node.js n'est pas installe sur cet ordinateur.
echo  1. Allez sur https://nodejs.org
echo  2. Telechargez la version LTS et installez-la : Suivant, Suivant, Terminer.
echo  3. Double-cliquez a nouveau sur lancer-atelier.bat
echo.
echo  En attendant, l'Atelier s'ouvre comme simple fichier : Qwant Junior s'ouvrira a cote.
start "" "%~dp0expose.html"
pause
exit /b

:pasdefichier
echo.
echo  Le fichier serveur-atelier.mjs est introuvable a cote de ce lanceur.
echo  Le zip doit etre EXTRAIT : clic droit sur le zip, puis Extraire tout.
echo  Ensuite, lancez lancer-atelier.bat depuis le dossier extrait.
echo.
pause
exit /b
