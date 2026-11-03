@echo off
setlocal enabledelayedexpansion
REM ==================================================================
REM  Vueltas 360 de los exhibidores (Sweet Flowers)
REM  1) Poné los .blend de Tobias en la carpeta "blend" (al lado de este archivo)
REM  2) Doble click en este archivo
REM  3) Las imagenes quedan en "salida\<nombre del archivo>\000.png ... 095.png"
REM ==================================================================
cd /d "%~dp0"

set "BLENDER="
for /f "delims=" %%B in ('where blender 2^>nul') do if not defined BLENDER set "BLENDER=%%B"
if not defined BLENDER (
  for /d %%D in ("C:\Program Files\Blender Foundation\*") do if exist "%%D\blender.exe" set "BLENDER=%%D\blender.exe"
)
if not defined BLENDER (
  echo No encontre Blender. Instalalo desde blender.org o edita este archivo con la ruta a blender.exe
  pause
  exit /b 1
)
echo Usando: %BLENDER%

if not exist "blend\*.blend" (
  echo No hay archivos .blend en la carpeta "blend".
  pause
  exit /b 1
)

for %%F in ("blend\*.blend") do (
  set "NOMBRE=%%~nF"
  if exist "salida\!NOMBRE!\095.png" (
    echo [ya estaba] !NOMBRE!
  ) else (
    echo.
    echo ===== Renderizando !NOMBRE! =====
    "%BLENDER%" -b "%%F" -P "render360.py" -- "%~dp0salida\!NOMBRE!"
  )
)

echo.
echo Terminado. Las vueltas estan en la carpeta "salida".
pause
