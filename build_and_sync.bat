@echo off
echo Building Urban Tide...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo npm install failed.
    exit /b %ERRORLEVEL%
)

call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo Build failed.
    exit /b %ERRORLEVEL%
)

echo Syncing dist/index.html to root for static hosting...
copy /Y dist\index.html index.html

echo Build and sync complete.
