@echo off
echo Sheikah Plate - Desktop Installer
echo ================================

REM Create app directory in user's documents
set APPDIR=%USERPROFILE%\Documents\SheikahPlate
echo Creating app directory at %APPDIR%
if not exist "%APPDIR%" mkdir "%APPDIR%"

REM Download the app files (you'll need to replace this URL with your actual GitHub Pages URL)
echo Downloading Sheikah Plate...
powershell -Command "& {Invoke-WebRequest -Uri 'https://abbycrockett.github.io/sheikah-plate/' -OutFile '%APPDIR%\index.html'}"
powershell -Command "& {Invoke-WebRequest -Uri 'https://abbycrockett.github.io/sheikah-plate/assets/' -OutFile '%APPDIR%\assets.zip'}"

REM Extract assets (if needed)
echo Extracting files...
powershell -Command "& {Expand-Archive -Path '%APPDIR%\assets.zip' -DestinationPath '%APPDIR%' -Force}"

REM Create desktop shortcut
echo Creating desktop shortcut...
set SHORTCUT=%USERPROFILE%\Desktop\Sheikah Plate.lnk
powershell -Command "& {$WshShell = New-Object -comObject WScript.Shell; $Shortcut = $WshShell.CreateShortcut('%SHORTCUT%'); $Shortcut.TargetPath = 'C:\Program Files\Google\Chrome\Application\chrome.exe'; $Shortcut.Arguments = '--app=file:///%APPDIR%/index.html'; $Shortcut.Save()}"

echo.
echo Installation complete!
echo You can now find "Sheikah Plate" on your desktop.
echo.
pause 