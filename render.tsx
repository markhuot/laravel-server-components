import React, {createElement} from 'react';
import { renderToPipeableStream } from 'react-dom/server';
import { ControllerDataContext } from './resources/js/utils';
const components = import.meta.glob('./resources/js/**/*.tsx');
import {proxy} from 'valtio';

export async function render(response, {path, props, csrf}: {path: string, props: Record<string, any>, csrf: string}) {
    if (! components[`./resources/js/${path}.tsx`]) {
        response.statusCode = 404;
        response.end('Not found');
        return;
    }

    const {default: Component} = await components[`./resources/js/${path}.tsx`]();

    const { pipe } = renderToPipeableStream((
        <ControllerDataContext.Provider value={{props: proxy(props)}}>
            <Component/>
        </ControllerDataContext.Provider>
        ), {
        bootstrapModules: [
            '//[::1]:5173/@vite/client',
            '//[::1]:5173/resources/js/app.js',
        ],
        bootstrapScriptContent: [
            'window.CSRF_TOKEN = ' + JSON.stringify(csrf),
            'window.PATH = ' + JSON.stringify(path),
            'window.PROPS = ' + JSON.stringify(props),
        ],
        onShellReady: () => {
            response.statusCode = 200;
            response.setHeader('content-type', 'text/html');
            pipe(response);
        }
    });
}
