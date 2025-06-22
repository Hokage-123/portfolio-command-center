@echo off
echo ========================================
echo   Portfolio Command Center Deployment
echo ========================================
echo.

echo Step 1: Checking Firebase CLI...
firebase --version
if %errorlevel% neq 0 (
    echo Firebase CLI not found. Installing...
    npm install -g firebase-tools
)

echo.
echo Step 2: Logging into Firebase...
echo This will open your browser for authentication.
pause
firebase login

echo.
echo Step 3: Initializing Firebase Hosting...
echo Please choose:
echo - Use existing project: project-roadmap-app
echo - Public directory: . (just press Enter)
echo - Single-page app: N
echo - Automatic builds: N  
echo - Overwrite index.html: N
pause
firebase init hosting

echo.
echo Step 4: Deploying to Firebase Hosting...
firebase deploy --only hosting

echo.
echo ========================================
echo   Deployment Complete!
echo ========================================
echo Your app should now be live at:
echo https://project-roadmap-app.web.app
echo.
pause
