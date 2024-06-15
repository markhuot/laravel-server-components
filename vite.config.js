import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.js'],
            refresh: true,
        }),
        laravelServerActions(),
    ],
});

function laravelServerActions() {
    return {
        name: 'laravel-server-actions',
        configureServer(server) {
            server.middlewares.use('/_render', (req, res, next) => {
                let body = []

                req.on('data', (chunk) => {
                    body.push(chunk);
                })

                req.on('end', async () => {
                    const props = JSON.parse(body);
                    const { render } = await server.ssrLoadModule(`./render.tsx`);
                    render(res, props);
                })
            });

            return () => server
        }
    };
}
