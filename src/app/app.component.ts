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

  async ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      // ✅ Smooth scroll only in browser
      const Lenis = (await import('@studio-freight/lenis')).default;

      const lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });

      const raf = (time: number) => {
        lenis.raf(time);
        requestAnimationFrame(raf);
      };

      requestAnimationFrame(raf);
    }
  }
}
