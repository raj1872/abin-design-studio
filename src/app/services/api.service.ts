import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformServer } from '@angular/common';
import { Observable, of } from 'rxjs';
import { TransferState, makeStateKey } from '@angular/platform-browser';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = 'https://work.reecosys.com/abin-design-studio/api/services';

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object,
    private state: TransferState
  ) {}

  // ===== Helper for SSR caching =====
  private getWithTransferState<T>(
    keyStr: string,
    apiCall: Observable<T>
  ): Observable<T> {
    const key = makeStateKey<T>(keyStr);

    if (this.state.hasKey(key)) {
      return of(this.state.get<T>(key, null as any));
    }

    return apiCall.pipe(
      tap((data) => {
        if (isPlatformServer(this.platformId)) {
          this.state.set(key, data);
        }
      })
    );
  }

  // ===== API Functions =====
  getCategories(): Observable<any> {
    return this.getWithTransferState(
      'categories',
      this.http.post(`${this.baseUrl}/categories`, {})
    );
  }

  getProjects(
    category_slug?: string,
    sub_category_slug?: string
  ): Observable<any> {
    const payload: any = {};

    if (category_slug) {
      payload.category_slug = category_slug;
    }

    if (sub_category_slug && sub_category_slug.trim() !== '') {
      payload.sub_category_slug = sub_category_slug;
    }

    // 🔹 Build cache key only from slugs
    let cacheKey = '';
    if (category_slug) cacheKey = category_slug;
    if (sub_category_slug && sub_category_slug.trim() !== '') {
      cacheKey = cacheKey
        ? `${cacheKey}-${sub_category_slug}`
        : sub_category_slug;
    }

    return this.getWithTransferState(
      cacheKey,
      this.http.post(`${this.baseUrl}/projects`, payload)
    );
  }

  getProjectBySlug(slug: string): Observable<any> {
    const payload: any = { slug };
    return this.getWithTransferState(
      slug,
      this.http.post(`${this.baseUrl}/projects`, payload)
    );
  }
  // ✅ NEW: Banners
  getBanners(): Observable<any> {
    return this.getWithTransferState(
      'banners',
      this.http.post(`${this.baseUrl}/banners`, {})
    );
  }

  // contactInfo
  getContactInfo(): Observable<any> {
    return this.getWithTransferState(
      'contact_info', // transfer state key
      this.http.post(`${this.baseUrl}/contact_info`, {}) // API call
    );
  }
}
