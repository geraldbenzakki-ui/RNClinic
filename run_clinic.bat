@echo off
setlocal

REM Start the static UI server from the repo root.
start "RNClinic UI" cmd /c "py -m http.server 8000 --bind 0.0.0.0"

REM Ensure API dependencies are installed.
py -m pip install -r server\requirements.txt

REM Start the API server from the server directory.
pushd server
start "RNClinic API" cmd /c "if exist .venv\\Scripts\\activate (call .venv\\Scripts\\activate) & py app.py"
popd

REM Launch Chrome pointed at the app.
start "" "C:\Program Files\Google\Chrome\Application\chrome.exe" "http://localhost:8000"

endlocal
