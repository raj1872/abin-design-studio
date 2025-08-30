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
  // private baseUrl = 'https://work.reecosys.com/abin-design-studio/api/services';
  private baseUrl = 'http://192.168.1.200/abin-design-studio/api/services';

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object,
    private state: TransferState
  ) {}

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

  getBanners(): Observable<any> {
    return this.getWithTransferState(
      'banners',
      this.http.post(`${this.baseUrl}/banners`, {})
    );
  }
  getHomePage(): Observable<any> {
    return this.getWithTransferState(
      'banners',
      this.http.post(`${this.baseUrl}/home_banners`, {})
    );
  }
  getPublications(): Observable<any> {
    return this.getWithTransferState(
      'publications',
      this.http.post(`${this.baseUrl}/publications`, {})
    );
  }
  getopenings(): Observable<any> {
    return this.getWithTransferState(
      'openings',
      this.http.post(`${this.baseUrl}/openings`, {})
    );
  }

  getopeningsDetails(slug: string): Observable<any> {
    return this.getWithTransferState(
      'openings',
      this.http.post(`${this.baseUrl}/openings`, { slug })
    );
  }

  careerInq(formData: any): Observable<any> {
    return  this.http.post(`${this.baseUrl}/career_inquiry`, formData);
  }

  getPublicationsDetails(slug: string): Observable<any> {
    const payload = { slug }; // safer than headers for SSR

    return this.getWithTransferState(
      'publications-detail-' + slug, // unique cache key per slug
      this.http.post(`${this.baseUrl}/publications/detail`, payload)
    );
  }

  getContactInfo(): Observable<any> {
    return this.getWithTransferState(
      'contact_info', // transfer state key
      this.http.post(`${this.baseUrl}/contact_info`, {}) // API call
    );
  }
}
