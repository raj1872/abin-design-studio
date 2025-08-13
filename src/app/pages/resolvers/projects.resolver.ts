import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiService } from '../../services/api.service';
import { TransferState, makeStateKey } from '@angular/platform-browser';
import { isPlatformServer } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class ProjectsResolver implements Resolve<any> {
  constructor(
    private apiService: ApiService,
    private state: TransferState,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    const category_slug = route.params['category_slug'] || 'all';
    const sub_category_slug = route.params['sub_category_slug'] || 'all';
    const keyStr = `projects-${category_slug}-${sub_category_slug}`;
    const key = makeStateKey<any>(keyStr);

    if (this.state.hasKey(key)) {
      return of(this.state.get(key, null as any));
    }

    return this.apiService.getProjects(category_slug, sub_category_slug).pipe(
      tap(data => {
        if (isPlatformServer(this.platformId)) {
          this.state.set(key, data);
        }
      })
    );
  }
}
