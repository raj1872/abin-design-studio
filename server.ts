import 'zone.js/node';

import { APP_BASE_HREF } from '@angular/common';
import { ngExpressEngine } from '@nguniversal/express-engine';
import express, { Request, Response } from 'express';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { AppServerModule } from './src/main.server';

// ✅ Import only the html formatter (avoids type errors)
import { html as beautifyHtml } from 'js-beautify';

export function app(): express.Express {
  const server = express();
  const distFolder = join(process.cwd(), 'dist/abin-design-studio/browser');
  const indexHtml = existsSync(join(distFolder, 'index.original.html'))
    ? 'index.original.html'
    : 'index';

  server.engine('html', ngExpressEngine({ bootstrap: AppServerModule }));
  server.set('view engine', 'html');
  server.set('views', distFolder);

  // Static assets
  // Static assets - disable cache in dev
  const isDev = process.env['NODE_ENV'] !== 'production';

  server.get(
    '*.*',
    express.static(distFolder, {
      maxAge: isDev ? '0' : '1y',
      etag: isDev ? false : true,
      setHeaders: (res) => {
        if (isDev) {
          res.setHeader(
            'Cache-Control',
            'no-store, no-cache, must-revalidate, proxy-revalidate'
          );
        }
      },
    })
  );

  // SSR route
  server.get('*', (req: Request, res: Response) => {
    res.render(
      indexHtml,
      { req, providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }] },
      (err: Error | null, html?: string) => {
        if (err) {
          console.error(err);
          res.status(500).send(err.message || 'Server Error');
          return;
        }

        if (!html) {
          res.status(500).send('No HTML returned from render');
          return;
        }

        // ✅ Must use ['NODE_ENV'] (TS strict mode fix)
        const isDev = process.env['NODE_ENV'] !== 'production';

        if (isDev) {
          html = beautifyHtml(html, {
            indent_size: 2,
            preserve_newlines: true,
            max_preserve_newlines: 2,
            wrap_line_length: 120,
          });
        }

        res.send(html);
      }
    );
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000;
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = (mainModule && mainModule.filename) || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
}

export * from './src/main.server';
