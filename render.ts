import React, {createElement} from 'react';
import { renderToPipeableStream } from 'react-dom/server';
const components = import.meta.glob('./resources/js/**/*.tsx');

export async function render(response, path, props={}) {
    const {default: Component} = await components[`./resources/js/${path}.tsx`]();

    const { pipe } = renderToPipeableStream(createElement(Component, props), {
        bootstrapModules: [
            '//[::1]:5173/@vite/client',
            '//[::1]:5173/resources/js/app.js',
        ],
        bootstrapScriptContent: [
            'window.PROPS = ' + JSON.stringify(props),
        ],
        onShellReady: () => {
            response.statusCode = 200;
            response.setHeader('content-type', 'text/html');
            pipe(response);
        }
    });
}
