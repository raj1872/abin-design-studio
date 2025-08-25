import { NgModule, APP_BOOTSTRAP_LISTENER } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
import { HttpClientModule } from '@angular/common/http';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';
import { ProjectsPreloadService } from './services/projects-preload.service';

@NgModule({
  imports: [
    AppModule,
    ServerModule,
    HttpClientModule,
  ],
  bootstrap: [AppComponent],
  providers: [
    {
      provide: APP_BOOTSTRAP_LISTENER,
      multi: true,
      useFactory: (preloadService: ProjectsPreloadService) => {
        return () => {
          const categories = ['architecture', 'interior', 'design']; // ✅ corrected
          const subCategories = {
            architecture: ['homes', 'hospitality', 'office'],
            interior: ['residential', 'commercial'],
            design: ['modern', 'classic'],
          };

          return preloadService.preloadAllProjects(categories, subCategories);
        };
      },
      deps: [ProjectsPreloadService],
    },
  ],
})
export class AppServerModule {}
