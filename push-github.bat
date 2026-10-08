@echo off
title Day code len GitHub - tinhnhadat.com
cd /d "%~dp0"
echo ====================================================
echo DANG DAY CODE LEN GITHUB REPOSITORY...
echo ====================================================
git push origin main
echo.
if %ERRORLEVEL% equ 0 (
    echo ====================================================
    echo [THANH CONG] Da day toan bo ma nguon len GitHub!
    echo Trang web tinhnhadat.com se tu dong cap nhat sau 1-2 phut.
    echo ====================================================
) else (
    echo [CHU Y] Neu xuat hien cua so dang nhap GitHub tren trinh duyet, hay bam Chap nhan de hoan tat.
)
pause
