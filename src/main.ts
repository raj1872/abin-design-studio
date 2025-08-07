import { enableProdMode } from '@angular/core';
import { environment } from './environments/environment';
import { platformBrowser } from '@angular/platform-browser';
import { AppModule } from './app/app.module';

if (environment.production) {
  enableProdMode();
}

document.addEventListener('DOMContentLoaded', () => {
  platformBrowser()
    .bootstrapModule(AppModule)
    .catch((err) => console.error(err));
});
