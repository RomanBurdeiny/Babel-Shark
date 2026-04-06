@echo off
REM Meteor CLI лежит в %LOCALAPPDATA%\.meteor — npm ставит только установщик, PATH часто не обновляют.
set "PATH=%LOCALAPPDATA%\.meteor;%PATH%"
meteor %*
