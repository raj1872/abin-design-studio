import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../../services/api.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProjectsResolver implements Resolve<any> {
  constructor(private apiService: ApiService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const category = route.paramMap.get('category_slug') || undefined;
    const subCategory = route.paramMap.get('sub_category_slug') || undefined;

    if (subCategory && subCategory.toLowerCase() === 'all') {
      return this.apiService.getProjects(category);
    }

    return this.apiService.getProjects(category, subCategory);
  }
}
