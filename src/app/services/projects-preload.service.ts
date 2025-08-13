import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { ApiService } from './api.service';
import { TransferState, makeStateKey } from '@angular/platform-browser';
import { isPlatformServer } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class ProjectsPreloadService {
  constructor(
    private apiService: ApiService,
    private state: TransferState,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  preloadAllProjects(categories: string[], subCategoriesMap: { [cat: string]: string[] }) {
    if (!isPlatformServer(this.platformId)) return;

    const promises: Promise<any>[] = [];

    for (const cat of categories) {
      const subCats = subCategoriesMap[cat] || ['all'];

      for (const sub of subCats) {
        // ✅ Wrap string key using makeStateKey
        const key = makeStateKey<any>(`projects-${cat}-${sub}`);

        if (this.state.hasKey(key)) continue;

        promises.push(
          this.apiService.getProjects(cat, sub).toPromise().then(data => {
            this.state.set(key, data);
          })
        );
      }
    }

    return Promise.all(promises);
  }
}
