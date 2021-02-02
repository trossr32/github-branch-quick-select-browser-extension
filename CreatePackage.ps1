$root = (Get-Location).Path
$publish = Join-Path (Get-Location).Path "Publish/"
		
# Create Publish folder or remove any existing release packages
if (!(Test-path $publish)) {
	mkdir $publish
} else {
	Set-Location $publish

	Get-Childitem -File -Recurse -ErrorAction SilentlyContinue | ForEach-Object { Remove-Item $_ }

	Set-Location $root
}

# build add on
$addon = Resolve-Path -LiteralPath "dist/"
	
npm i -g web-ext

web-ext build -s $addon -a $publish -o --filename "github-branch-quick-select-{version}.zip"

Set-Location $publish

$zip = Get-Childitem -Include *zip* -File -Recurse -ErrorAction SilentlyContinue

Copy-Item -Path $zip -Destination ($zip.FullName -replace "zip", "xpi") -Force

Set-Location $root

# Build source archive for review process
$version = ''
if ($zip -match '.+(?<Version>\d+\.\d+\.\d+\.\d+)\.zip') {
	$version = $Matches.Version
}

$review = Join-Path $publish "source-review-$version"

if (!(Test-path $review)) {
	mkdir $review
}

foreach ($path in @('Create Packages.bat', 'CreatePackage.ps1', 'Gruntfile.js', 'package.json', 'ReviewerNotes.md', 'src/')) {
	Copy-Item -Path (Join-Path $root $path) -Destination $review -Recurse
}

Remove-Item -Path (Join-Path $root 'src/.vs/') -Recurse -Force

$zip = Join-Path $publish "source-review-$version.zip"

Add-Type -assembly "system.io.compression.filesystem"

[io.compression.zipfile]::CreateFromDirectory($review, $zip)

Remove-Item -Path $review -Recurse -Force