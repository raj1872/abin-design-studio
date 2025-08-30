import { AfterViewInit, Component, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {

  categories: any[] = [];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    // ✅ Call Categories API globally (SSR + Browser safe)
    this.apiService.getCategories().subscribe({
      next: (res) => {
        this.categories = res.data || res;
        // console.log('Global categories:', this.categories);
      },
      error: (err) => console.error('Error fetching categories:', err)
    });
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      // ✅ Browser-only logic (empty for now since Lenis is removed)
    }
  }
}
