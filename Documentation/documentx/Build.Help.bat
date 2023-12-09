REM @echo off

echo d | xcopy ".\templates" "C:\ProgramData\Innovasys\DocumentX\templates" /S /Y

REM Build the Help File and copy to output directory
Echo about to start the help build build ... 
call "C:\Program Files (x86)\Innovasys\DocumentX2022\bin\DocumentXCommandLinex64.exe" ".\SciChart.js.dxp"
Echo Documentation Build Complete, Error Code = %ERRORLEVEL% 

if %ERRORLEVEL% EQU -1 goto :projectMissing
if %ERRORLEVEL% EQU -2 goto :buildReadiness
if %ERRORLEVEL% EQU -3 goto :buildConfig
if %ERRORLEVEL% EQU -10 goto :unexpected
if %ERRORLEVEL% EQU -100 goto :partiallyCompleted
if %ERRORLEVEL% EQU -101 goto :error

Echo Building sitemap ... 
".\BuildSitemap.PS1" -folderPath "DocsOut" -rootUrl "https://www.scichart.com/documentation/js/current" 

@echo off 

Echo SUCCESS KID!
exit 0

:projectMissing
echo Project file missing or not found. The project filename could not be located. Ensure that you enclose any paths containing spaces with quote characters.
exit -1

:buildReadiness
echo Build readiness issues exist that prevent the build from executing. Open the project in Document! X and start the build to view the Build Readiness issues.
exit -2

:buildConfig
echo Build Configuration not found. The build configuration name specified using the /buildconfiguration parameter could not be found in the project.
exit -3

:unexpected
echo An unexpected error was encountered during the build process.
exit -10

:partiallyCompleted
echo Build partially completed (one or more outputs completed with warnings).
exit -100

:error
echo One or more outputs completed with errors.
exit -101