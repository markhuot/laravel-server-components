<?php

/**
 * @param array<string, mixed> $props
 */
function react(string $path, array $props) {
    $response = (new \GuzzleHttp\Client())
        ->request('POST', 'http://localhost:5173/_render', [
            'stream' => true,
            'json' => ['path' => $path, 'props' => $props],
        ]);

    $body = $response->getBody();

    header("Content-Type: text/html");

    while (! $body->eof()) {
        echo $body->read(1024);
        //echo \GuzzleHttp\Psr7\Utils::readLine($body);
        //echo "HERE";
        ob_flush();
        flush();
    }

    return '';
}
