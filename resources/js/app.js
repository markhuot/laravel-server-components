import './bootstrap';
import {createElement} from "react";
import {hydrateRoot} from "react-dom/client";
import {ControllerDataContext} from './utils.tsx';
import {proxy} from 'valtio';

const components = import.meta.glob('./**/*.tsx');

const reactiveProps = proxy(window.PROPS || {});

(async function () {
    const path = window.PATH;
    const exports = await (components[`./${path}.tsx`]());
    hydrateRoot(document,
        createElement(ControllerDataContext.Provider, {value: {
            refresh: async () => {
                const response = await axios.get(window.location, {
                    headers: {
                        'X-Zen-Request': 'data',
                    }
                });
                Object.assign(reactiveProps, response.data);
            },
            props: reactiveProps,
        }},
            createElement(exports.default, {})
        )
    );
})()

