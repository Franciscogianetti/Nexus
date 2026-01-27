@echo off
call npx vite build
if exist dist\vite-template.html (
    move /y dist\vite-template.html dist\index.html
)
copy /y dist\index.html index.html
