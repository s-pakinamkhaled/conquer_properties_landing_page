$src = "C:\Users\pakinam\.cursor\projects\d-Downloads-Conquer-landing-page\assets"
$dst = "d:\Downloads\Conquer landing page\conquer-properties\public\images\modon"
New-Item -ItemType Directory -Force -Path $dst | Out-Null

$map = @{
  'modon12-ca1aca9d' = 'modon-01.jpg'
  'modon13-f1586403' = 'modon-02.jpg'
  'modon14-b526c361' = 'modon-03.jpg'
  'modon11-a0b132c4' = 'modon-04.jpg'
  'modon10-ee4e4e36' = 'modon-05.jpg'
  'modon1-e124309c'  = 'modon-06.jpg'
  'modon5-e1f9106d'  = 'modon-07.jpg'
  'modon8-6bf58ed9'  = 'modon-08.jpg'
  'modon6-22e2fbe4'  = 'modon-09.jpg'
  'modon2-fedc1389'  = 'modon-10.jpg'
  'modon3-5dd285db'  = 'modon-11.jpg'
  'modon9-355f4785'  = 'modon-12.jpg'
  'modon7-529c2c27'  = 'modon-13.jpg'
  'modon4-40caa348'  = 'modon-14.jpg'
  'WhatsApp_Image_2026-11-13_at_3.41.43_PM-19422683' = 'modon-15.jpg'
  'WhatsApp_Image_2026-11-13_at_3.41.35_PM-dd52e8f0' = 'modon-16.jpg'
}

Get-ChildItem $src -File | ForEach-Object {
  foreach ($key in $map.Keys) {
    if ($_.Name -like "*$key*") {
      Copy-Item $_.FullName (Join-Path $dst $map[$key]) -Force
    }
  }
}

Get-ChildItem $dst | Select-Object Name, Length
