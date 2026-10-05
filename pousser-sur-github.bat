@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ====================================================
echo  Envoi du projet sur GitHub
echo  Pre-requis : Git installe (https://git-scm.com) et un depot GitHub VIDE deja cree.
echo ====================================================
set /p URL=Collez l'adresse du depot (ex. https://github.com/VOTRE-COMPTE/animations-pour-comprendre.git) :
git init
git add .
git commit -m "Animations pour comprendre : 52 animations cycle 3 (histoire, geographie, sciences)"
git branch -M main
git remote add origin %URL%
git push -u origin main
echo.
echo Termine. Si une fenetre de connexion GitHub s'est ouverte, connectez-vous puis relancez ce fichier en cas d'erreur.
pause
