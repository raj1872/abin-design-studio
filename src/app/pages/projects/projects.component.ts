import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data, Params } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit {
  categories: any[] = [];          // all parent categories
  childCategories: any[] = [];     // children of selected parent
  selectedCategory: any = null;    // parent category
  selectedSubCategory: any = null; // sub-category if present
  projects: any[] = [];            // projects (from resolver)
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    // console.log('✅ ProjectsComponent initialized');

    // ✅ Load projects (resolver always runs)
    this.route.data.subscribe((data: Data) => {
      console.log('📦 Resolver data received:', data);
      this.projects = data['projectsData']?.list || [];
      // console.log('📂 Projects set:', this.projects);
    });

    // ✅ Watch route params
    this.route.params.subscribe((params: Params) => {
      // console.log('🛣️ Route params changed:', params);
      const categorySlug = params['category_slug'];
      const subCategorySlug = params['sub_category_slug'];

      // console.log('➡️ categorySlug:', categorySlug, ' | subCategorySlug:', subCategorySlug);

      if (categorySlug) {
        this.loadCategories(categorySlug, subCategorySlug);
      }
    });
  }

  loadCategories(categorySlug: string, subCategorySlug?: string): void {
    // console.log('📡 Fetching categories for slug:', categorySlug, ' subSlug:', subCategorySlug);

    this.loading = true;
    this.apiService.getCategories().subscribe({
      next: (res: any) => {
        console.log('✅ API response received:', res);

        if (res && Array.isArray(res.list)) {
          this.categories = res.list;
          // console.log('📋 Categories:', this.categories);

          // ✅ find parent
          this.selectedCategory = this.categories.find(c => c.slug === categorySlug);
          // console.log('🔍 Selected parent category:', this.selectedCategory);
          // console.log(this.selectedCategory);
          if (this.selectedCategory) {
            this.childCategories = this.selectedCategory.child_categories;
            // console.log('👶 Child categories:', this.childCategories);

            // ✅ check sub category
            if (subCategorySlug) {
              this.selectedSubCategory = this.childCategories.find(
                (c: any) => c.slug === subCategorySlug
              );
              // console.log('🎯 Selected sub-category:', this.selectedSubCategory);
            } else {
              this.selectedSubCategory = null;
              // console.log('ℹ️ No sub-category selected');
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
        // console.log('✅ Loading complete. Current state:', {
        //   selectedCategory: this.selectedCategory,
        //   selectedSubCategory: this.selectedSubCategory,
        //   childCategories: this.childCategories,
        //   projects: this.projects
        // });
      },
      error: (err: any) => {
        console.error('❌ Error fetching categories:', err);
        this.loading = false;
      }
    });
  }
}
