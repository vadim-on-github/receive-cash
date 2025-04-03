<?php
global $siteUrl;
require_once 'env.php';
function file_get_contents_curl($url, $binary)
{
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_HEADER, 0);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_URL, $url);//enable headers
    if (!$binary) {
        curl_setopt($ch, CURLOPT_HEADER, 1);
    }
    $output = curl_exec($ch);
    curl_close($ch);
    if ($binary) {
        return $output;
    }
    $headers = [];
    $output = rtrim($output);
    $data = explode("\n", $output);
    $headers['status'] = $data[0];
    array_shift($data);
    $bodyStartsAtLine = 0;

    foreach ($data as $lineNum => $part) {

        //some headers will contain ":" character (Location for example), and the part after ":" will be lost, Thanks to @Emanuele
        $middle = explode(":", $part, 2);

        //Suppress warning message if $middle[1] does not exist, Thanks to @crayons
        if (!isset($middle[1])) {
            $middle[1] = null;
        }
        $headerName = trim($middle[0]);
        if ($headerName) {
            $headers[$headerName] = trim($middle[1]);
        } else {
            $bodyStartsAtLine = $lineNum;
            break;
        }
    }

    $body = [];
    for ($i = $bodyStartsAtLine; $i < count($data); $i++) {
        $line = trim($data[$i]);
        if ($line) {
            $body[] = $line;
        }
    }

    return (object)[
        "headers" => $headers,
        "body" => $body
    ];
}

$logo_urls = [
//    "https://logo.chainbit.xyz/" . strtolower($_GET['symbol']), //now offline
    'https://auth.' . $siteUrl . "/crypto-logos-2/" . str_replace(' ', '-', strtolower($_GET['name'])) . '-' . strtolower($_GET['symbol']) . "-logo.svg",
    'https://auth.' . $siteUrl . "/crypto-logos-2/" . str_replace(' ', '-', strtolower($_GET['name'])) . '-' . strtolower($_GET['symbol']) . "-logo.png",
    urldecode($_GET['default']),
    'https://auth.' . $siteUrl . "/crypto-logos-1/" . strtolower($_GET['symbol']) . ".svg",
    "https://cryptologos.cc/logos/" . str_replace(' ', '-', strtolower($_GET['name'])) . '-' . strtolower($_GET['symbol']) . "-logo.svg", // currently giving mixed results, sometimes gives a binary response instead of svg todo enable later and see if they fixed it / skip if a response is binary
];

foreach ($logo_urls as $logo_url) {
    preg_match("#\.([^\/.]+)$#", $logo_url, $matches);
    $logo_ext = $matches[1];

    if ($logo_ext === 'svg') {
        $logo_data = file_get_contents_curl($logo_url, false);
        if (strpos($logo_data->headers['status'], '200') !== false) {
            header('Content-type: ' . $logo_data->headers['content-type']);
//    header("Content-type: text/html");
//    print_r($logo_data);
            echo join("\n", $logo_data->body);
            break;
        }
    } else {
        /* Mac/Windows servers:
        $im = imagecreatefrompng($logo_url);
        $cropped = imagecropauto($im, IMG_CROP_DEFAULT);

        if ($cropped !== false) { // in case a new image resource was returned
            imagedestroy($im);    // we destroy the original image
            $im = $cropped;       // and assign the cropped image to $im
        }
        imagepng($im);
        imagedestroy($im);*/


        /*Another method
        //Add background transmparent
        $background = 'none';
        $image = new Imagick($logo_url);
        $image->trimImage(0);
        $imageWidth = 250;
        $imageHeight = 250;
        //add transparent border
        //border add start
//        Set border format
        $borderWidth = 20;
        $borderColor = 'none';
        $borderPadding = 10;
        $imageWithBorder = new Imagick();
        // Set image canvas
        $imageWithBorder->newImage($imageWidth, $imageHeight, new ImagickPixel(
            'none'));
        // Create ImagickDraw object to draw border
        $border = new ImagickDraw();
        // Set fill color to transparent
        $border->setFillColor('none');
        // Set border format
        $border->setStrokeColor(new ImagickPixel($borderColor));
        $border->setStrokeWidth($borderWidth);
        $border->setStrokeAntialias(false);

        $imageWidth = $image->getImageWidth() + (2 * ($borderWidth +
                    $borderPadding));
        $imageHeight = $image->getImageHeight() + (2 * ($borderWidth +
                    $borderPadding));
        $border->rectangle(
            $borderWidth / 2 - 1,
            $borderWidth / 2 - 1,
            $imageWidth - (($borderWidth / 2)),
            $imageHeight - (($borderWidth / 2))
        );
        // Apply drawed border to final image
        $imageWithBorder->drawImage($border);
        $imageWithBorder->setImageFormat('png');
        // Put source image to final image
        $imageWithBorder->compositeImage(
            $image, Imagick::COMPOSITE_DEFAULT,
            $borderWidth + $borderPadding,
            $borderWidth + $borderPadding
        );

        $imageWithBorder->writeImage();*/

        $logo_data = file_get_contents_curl($logo_url, true);
        if (strpos($logo_data, '404 Not Found') === false) {
            header("Content-type: image/" . $logo_ext);
            echo $logo_data;
            break;
        }
    }
}
