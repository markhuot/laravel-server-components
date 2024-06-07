import './bootstrap';
import {createElement} from "react";
import {hydrateRoot} from "react-dom/client";

const components = import.meta.glob('./**/*.tsx');

(async function () {
    const exports = await (components['./dashboard.tsx']());
    hydrateRoot(document, createElement(exports.default, window.PROPS));
})()

