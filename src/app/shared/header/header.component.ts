import {
  Component,
  HostListener,
  OnInit,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  categories: any[] = [];

  isMenuActive = false;
  isMenuLinksVisible = false;
  isProjectsPage = false;
  projectListingTrue = false;
  isNewsPage = false;
  isNewsDetailPage = false;
  isLandingPage = false;
  isTeamPage = false;
  isPublicationsPage = false;
  isCreditsPage = false;

  private prevScrollTop = 0;
  private scrollYBeforeLock = 0;
  isHeaderHidden = false;
  isHeaderChanged = false;

  // ✅ New states for multi-step nav
  isProjectsOpen = false;
  activeCategory: number | null = null;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    private apiService: ApiService
  ) { }

  ngOnInit(): void {
    this.checkPageType(this.router.url);

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.checkPageType(event.urlAfterRedirects);
      });

    // ✅ Fetch categories
    this.apiService.getCategories().subscribe({
      next: (res) => {
        if (res && Array.isArray(res.list)) {
          this.categories = res.list || [];
        } else {
          this.categories = [];
        }
      },
      error: (err) => console.error('Error fetching categories:', err),
    });
  }

  private checkPageType(url: string): void {
    this.isProjectsPage = /^\/projects(\/|$)/.test(url);
    this.isLandingPage = url === '/' || url.startsWith('/landing');
    this.isTeamPage = /^\/our-team(\/|$)/.test(url);
    this.isPublicationsPage = /^\/publications(\/|$)/.test(url);
    this.isCreditsPage = /^\/site-credits(\/|$)/.test(url);
    this.isNewsPage = /^\/news(\/|$)/.test(url);
    this.isNewsDetailPage = /^\/news-detail(\/|$)/.test(url);
    this.projectListingTrue = /^\/projects-svg(\/|$)/.test(url);
  }

  private lockScroll(lock: boolean): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const body = document.body;
    const html = document.documentElement;

    if (lock) {
      this.scrollYBeforeLock = window.scrollY;
      body.style.position = 'fixed';
      body.style.top = `-${this.scrollYBeforeLock}px`;
      body.style.left = '0';
      body.style.right = '0';
      body.style.overflow = 'hidden';
      body.style.height = '100%';
      html.style.overflow = 'hidden';
    } else {
      body.style.position = '';
      body.style.top = '';
      body.style.left = '';
      body.style.right = '';
      body.style.overflow = '';
      body.style.height = '';
      html.style.overflow = '';
      window.scrollTo(0, this.scrollYBeforeLock);
    }
  }

  toggleMenu(): void {
    this.isMenuActive = !this.isMenuActive;
    this.lockScroll(this.isMenuActive);

    if (this.isMenuActive) {
      setTimeout(() => {
        this.isMenuLinksVisible = true;
      }, 500);
    } else {
      this.isMenuLinksVisible = false;
    }
  }

  closeMenu(): void {
    this.isMenuActive = false;
    this.isMenuLinksVisible = false;
    this.lockScroll(false);
    this.closeProjects(); // ✅ Also close Projects & categories
  }

  // ✅ Multi-step navigation methods
  toggleProjects(): void {
    this.isProjectsOpen = !this.isProjectsOpen;
    if (!this.isProjectsOpen) {
      this.activeCategory = null;
    }
  }

  closeProjects(): void {
    this.isProjectsOpen = false;
    this.activeCategory = null;
  }

  toggleCategory(index: number): void {
    this.activeCategory = this.activeCategory === index ? null : index;
  }

  closeCategory(): void {
    this.activeCategory = null;
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscape(): void {
    this.closeMenu();
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const scrollTop = window.scrollY;
    this.isHeaderHidden = scrollTop > this.prevScrollTop && scrollTop > 0;
    this.prevScrollTop = scrollTop;
    this.isHeaderChanged = scrollTop > 100;
  }
}
