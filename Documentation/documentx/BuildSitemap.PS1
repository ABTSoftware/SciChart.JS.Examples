# Usage: .\BuildSitemap.ps1 -folderPath 'C:\Path\To\Your\Folder' -rootUrl 'https://www.scichart.com/documentation/win/current/'
# 

param (
    [string]$folderPath,
	[string]$rootUrl
)

# Load the System.Web assembly if not already loaded
Add-Type -AssemblyName System.Web

# Check if the folder path parameter is provided
if (-not $folderPath) {
    Write-Host "Please provide the folder path as a parameter, e.g., -folderPath 'C:\Path\To\Your\Folder'"
    exit
}

# Check if the root URL path parameter is provided 
if (-not $rootUrl) {
	Write-Host "Please provide the root URL as a parameter, e.g., -rootUrl 
	'https://www.mywebsite.com/"
	exit
}

# Remove any trailing slash from $rootUrl if it exists
if ($rootUrl.EndsWith("/")) {
    $rootUrl = $rootUrl.TrimEnd("/")
}

# Create an array to store sitemap entries
$sitemapEntries = @()

# Get the current date in the desired format (YYYY-MM-DDTHH:mm:ss+00:00)
$today = Get-Date -Format "yyyy-MM-ddTHH:mm:ss+00:00"

$itemCount = 0;

# Loop through HTML files in the folder
Get-ChildItem -Path $folderPath -Filter *.html | ForEach-Object {
    $filePath = $_.FullName
	
    # Parse the HTML file to extract the title (assuming it's within <title> tags)
    # #  $title = (Get-Content $filePath | Select-String -Pattern '<title>(.*?)<\/title>').Matches[0].Groups[1].Value
	

	# Get the filename without path for the HTML file on disk 
	$filename = [System.IO.Path]::GetFileName($filePath)
	
	# and HTML encode it
	$encodedFilename = [uri]::EscapeDataString($filename)

    # Build the URL by replacing backslashes with forward slashes
    $url = $rootUrl + "/" + $encodedFilename

    # Create a sitemap entry object
    $sitemapEntry = [PSCustomObject]@{
        loc       = $url
        lastmod   = $today
        changefreq= "weekly"
        priority  = 0.5
        # title     = $title
    }

    # Add the entry to the array
    $sitemapEntries += $sitemapEntry
	
	# Write-Host "URL:`n $url`n $title";
	$itemCount++;
}

# Create the sitemap.xml content
$sitemapContent = @"
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
$($sitemapEntries | ForEach-Object {
    @"
    <url>
        <loc>$($_.loc)</loc>
        <lastmod>$($_.lastmod)</lastmod>
        <changefreq>$($_.changefreq)</changefreq>
        <priority>$($_.priority)</priority>
     </url>

"@
})</urlset>
"@

Write-Host "Creating sitemap: $folderPath\sitemap.xml with $itemCount items"

# Save the sitemap.xml content to a file
$sitemapContent | Out-File -FilePath "$folderPath\sitemap.xml" -Encoding UTF8
