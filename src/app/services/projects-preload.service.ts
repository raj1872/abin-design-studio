import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { ApiService } from './api.service';
import { TransferState, makeStateKey } from '@angular/platform-browser';
import { isPlatformServer } from '@angular/common';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProjectsPreloadService {
  constructor(
    private apiService: ApiService,
    private state: TransferState,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  async preloadAllProjects(
    categories: string[],
    subCategoriesMap: { [cat: string]: string[] }
  ) {
    if (!isPlatformServer(this.platformId)) return;

    const promises: Promise<void>[] = [];

    for (const cat of categories) {
      const subCats = subCategoriesMap[cat] || [];

      if (subCats.length === 0) {
        // 🔹 Only category
        const key = makeStateKey<any>(cat);
        if (!this.state.hasKey(key)) {
          const p = firstValueFrom(this.apiService.getProjects(cat))
            .then((data) => this.state.set(key, data))
            .catch((err) =>
              console.error(`❌ Error preloading projects for ${cat}:`, err)
            );
          promises.push(p);
        }
      } else {
        // 🔹 Category + Subcategories
        for (const sub of subCats) {
          if (!sub || sub.toLowerCase() === 'all') continue; // 🚫 skip "all"

          const key = makeStateKey<any>(`${cat}-${sub}`);
          if (this.state.hasKey(key)) continue;

          const p = firstValueFrom(this.apiService.getProjects(cat, sub))
            .then((data) => this.state.set(key, data))
            .catch((err) =>
              console.error(`❌ Error preloading projects for ${cat}/${sub}:`, err)
            );
          promises.push(p);
        }
      }
    }

    await Promise.all(promises);
  }
}
