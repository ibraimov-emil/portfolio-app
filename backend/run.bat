@echo off
powershell -File A:\my-projects\emil\backend\start-dev.ps1 > A:\tmp\strapi_out.txt 2>&1
type A:\tmp\strapi_out.txt
