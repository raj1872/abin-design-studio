import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data, Params } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {
  categories: any[] = [];          
  childCategories: any[] = [];     
  selectedCategory: any = null;    
  selectedSubCategory: any = null; 
  projects: any[] = [];            
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {

    this.route.data.subscribe((data: Data) => {
      console.log('📦 Resolver data received:', data);
      this.projects = data['projectsData']?.list || [];
    });

    this.route.params.subscribe((params: Params) => {
      const categorySlug = params['category_slug'];
      const subCategorySlug = params['sub_category_slug'];
      if (categorySlug) {
        this.loadCategories(categorySlug, subCategorySlug);
      }
    });
  }

  loadCategories(categorySlug: string, subCategorySlug?: string): void {
    this.loading = true;
    this.apiService.getCategories().subscribe({
      next: (res: any) => {
        console.log('✅ API response received:', res);

        if (res && Array.isArray(res.list)) {
          this.categories = res.list;
          this.selectedCategory = this.categories.find(c => c.slug === categorySlug);
          if (this.selectedCategory) {
            this.childCategories = this.selectedCategory.child_categories;
            if (subCategorySlug) {
              this.selectedSubCategory = this.childCategories.find(
                (c: any) => c.slug === subCategorySlug
              );
            } else {
              this.selectedSubCategory = null;
            }
          } else {
            console.warn('⚠️ No parent category found for slug:', categorySlug);
            this.childCategories = [];
            this.selectedSubCategory = null;
          }
        } else {
          console.warn('⚠️ API did not return a valid list:', res);
          this.categories = [];
          this.childCategories = [];
          this.selectedSubCategory = null;
        }

        this.loading = false;
      },
      error: (err: any) => {
        console.error('❌ Error fetching categories:', err);
        this.loading = false;
      }
    });
  }
}
