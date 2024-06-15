import React from 'react';

export default function Layout({children}) {
    return (
        <html>
        <head>
            <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body className="bg-slate-300">
            {children}
        </body>
        </html>
    )
}
