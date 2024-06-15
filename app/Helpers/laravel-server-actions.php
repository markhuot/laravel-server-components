<?php

/**
 * @param array<string, mixed> $props
 */
function react(string $path, array $props) {
    if (request()->headers->get('X-Zen-Request') === 'data') {
        return $props;
    }

    $response = (new \GuzzleHttp\Client([
        'http_errors' => false,
    ]))
        ->request('POST', 'http://localhost:5173/_render', [
            'stream' => true,
            'json' => [
                'path' => $path,
                'csrf' => csrf_token(),
                'props' => $props,
            ],
        ]);

    abort_if($response->getStatusCode() >= 400, $response->getStatusCode(), $response->getBody());

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
