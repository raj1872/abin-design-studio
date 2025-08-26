import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  PLATFORM_ID,
  QueryList,
  ViewChildren,
  ViewChild,
  OnInit,
  OnDestroy,
  Renderer2,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';
import { ApiService } from '../../services/api.service';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements AfterViewInit, OnInit, OnDestroy {
  @ViewChildren('animateUnderline') underlineElements!: QueryList<ElementRef>;
  @ViewChild('imageStrip', { static: false }) imageStripRef!: ElementRef;
  @ViewChild('imageStripContainer', { static: false })
  imageStripContainerRef!: ElementRef;
  @ViewChild('bannerVideo') bannerVideo!: ElementRef<HTMLVideoElement>;

  // ✅ API banners
  homePageDetails: any[] = [];
  isLoading = true;

  isBrowser = false;
  private loadingTimeout: any;
  private scrollListener: (() => void) | null = null;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private titleService: Title,
    private apiService: ApiService,
    private metaService: Meta,
    private renderer: Renderer2,
    private router: Router
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.titleService.setTitle('Home | Abin Design Studio');

    this.metaService.updateTag({
      name: 'description',
      content:
        'ADS is a collaborative design practice whose work expands the context of built and natural landscapes.',
    });

    this.metaService.updateTag({
      name: 'keywords',
      content:
        'architecture, interior design, timeline, projects, 2010, 2015, 2020, present, Abin Design Studio',
    });

    this.metaService.updateTag({
      property: 'og:title',
      content: 'Abin Design Studio Project Timeline',
    });
    this.metaService.updateTag({
      property: 'og:description',
      content:
        'Browse our timeline of architecture and interior design projects from 2010 to Present.',
    });
    this.metaService.updateTag({ property: 'og:image', content: '' });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });
    this.metaService.updateTag({ property: 'og:url', content: '' });

    // ✅ Fetch API data
    this.apiService.getHomePage().subscribe({
      next: (res: any) => {
        if (res?.success && res?.list) {
          this.homePageDetails = res.list;
          // 🎯 Try playing video once API data renders
          setTimeout(() => this.playBannerVideo(), 200);
        }
        setTimeout(() => {
          this.isLoading = false;
        }, 500);
      },
      error: (err) => {
        console.error('API error:', err);
        setTimeout(() => {
          this.isLoading = false;
        }, 500);
      },
    });

    // ✅ Restart video on navigation back to home
    if (this.isBrowser) {
      this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd && event.urlAfterRedirects === '/home') {
          setTimeout(() => this.playBannerVideo(true), 200);
        }
      });
    }
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.playBannerVideo();

      // ✅ Parallax scroll effect (images + videos)
      this.scrollListener = this.renderer.listen('window', 'scroll', () => {
        const parallaxEls = document.querySelectorAll<HTMLElement>(
          '.parallax-section .banner-bg-image, .parallax-section .banner-video'
        );
        const speed = 0.3;
        parallaxEls.forEach((el) => {
          const offset = window.scrollY * speed;
          this.renderer.setStyle(el, 'transform', `translateY(${offset}px)`);
        });
      });
    }
  }

  private playBannerVideo(reset: boolean = false): void {
    const videoEl = this.bannerVideo?.nativeElement;
    if (videoEl) {
      videoEl.muted = true;
      videoEl.playsInline = true;
      if (reset) videoEl.currentTime = 0;

      videoEl.play().catch((err) => {
        console.warn('Autoplay blocked:', err);
      });
    }
  }

  ngOnDestroy(): void {
    if (this.loadingTimeout) {
      clearTimeout(this.loadingTimeout);
    }
    if (this.scrollListener) {
      this.scrollListener();
      this.scrollListener = null;
    }
  }

  // ------------------------------
  // ⭐ Existing timeline logic kept below (unchanged)
  // ------------------------------
  activeTab: 'architecture' | 'interior' | 'all' = 'architecture';
  activeYear = '2010';
  currentIndex = 0;

  years: string[] = ['2010', '2015', '2020', 'PRESENT'];
  grayShades = [
    'C1C1C1',
    '111111',
    '222222',
    '333333',
    '444444',
    '555555',
    '666666',
    '777777',
    '888888',
    '999999',
    'AAAAAA',
    'BBBBBB',
    'CCCCCC',
    'DDDDDD',
    'EEEEEE',
    'F1F1F1',
    'F5F5F5',
    'FAFAFA',
    'FFFFFF',
  ];

  imageGroups: Record<string, string[]> = {
    '2010': [
      'C1C1C1',
      '111111',
      '222222',
      '999999',
      'AAAAAA',
      'BBBBBB',
      'CCCCCC',
      'C1C1C1',
      '111111',
      '222222',
      '999999',
      'AAAAAA',
      'BBBBBB',
      'CCCCCC',
      'C1C1C1',
      '111111',
      '222222',
      '999999',
      'AAAAAA',
      'BBBBBB',
      'CCCCCC',
    ],
    '2015': [
      '555555',
      '666666',
      '777777',
      '888888',
      'C1C1C1',
      '111111',
      '888888',
      'C1C1C1',
      '111111',
      '222222',
    ],
    '2020': [
      '999999',
      'AAAAAA',
      'BBBBBB',
      'CCCCCC',
      '555555',
      '666666',
      '777777',
      '888888',
      'CCCCCC',
      '555555',
      '666666',
      '777777',
      '888888',
    ],
    PRESENT: [
      'DDDDDD',
      'EEEEEE',
      'F1F1F1',
      'F5F5F5',
      'FAFAFA',
      '555555',
      '666666',
      'F1F1F1',
      'F5F5F5',
      'FAFAFA',
      '555555',
      '666666',
      '777777',
      '888888',
    ],
  };

  get projects(): Record<
    'architecture' | 'interior',
    Record<string, string[]>
  > {
    const makeImages = (colors: string[]) =>
      colors.map((c) => `https://dummyimage.com/600x600/${c}/${c}`);

    const buildProjectImages = (shades: string[]): Record<string, string[]> => {
      let idx = 0;
      const imagesByYear: Record<string, string[]> = {};
      for (const year of this.years) {
        const colorCodes = this.imageGroups[year] || [];
        const currentShades = shades.slice(idx, idx + colorCodes.length);
        imagesByYear[year] = makeImages(
          currentShades.length ? currentShades : colorCodes
        );
        idx += colorCodes.length;
      }
      return imagesByYear;
    };

    const half = Math.floor(this.grayShades.length / 2);
    const archShades = this.grayShades.slice(0, half);
    const intShades = this.grayShades.slice(half);

    return {
      architecture: buildProjectImages(archShades),
      interior: buildProjectImages(intShades),
    };
  }

  get filteredImages(): string[] {
    let images: string[] = [];
    if (this.activeTab === 'all') {
      images = [
        ...(this.projects.architecture[this.activeYear] || []),
        ...(this.projects.interior[this.activeYear] || []),
      ];
    } else {
      images = this.projects[this.activeTab]?.[this.activeYear] || [];
    }
    return images;
  }

  getPointerLeftPercent(): number {
    const yearIndex = this.years.indexOf(this.activeYear);
    const totalYears = this.years.length;
    if (yearIndex === -1 || totalYears <= 1) return 0;
    return (yearIndex / (totalYears - 1)) * 99;
  }

  setTab(tab: 'architecture' | 'interior' | 'all'): void {
    this.activeTab = tab;
    this.activeYear = '2010';
    setTimeout(() => {
      this.scrollToYear('2010');
    });
  }

  onImageScroll(): void {
    const strip = this.imageStripRef.nativeElement as HTMLElement;
    const imageEls = strip.querySelectorAll('img');
    if (!imageEls.length) return;
    const scrollLeft = strip.scrollLeft;
    const imageWidth = imageEls[0].offsetWidth + 16;
    const index = Math.round(scrollLeft / imageWidth);
    this.currentIndex = index;
    let runningIndex = 0;
    for (const year of this.years) {
      const count =
        this.activeTab === 'all'
          ? (this.projects.architecture[year]?.length || 0) +
            (this.projects.interior[year]?.length || 0)
          : this.projects[this.activeTab]?.[year]?.length || 0;
      if (index < runningIndex + count) {
        if (this.activeYear !== year) {
          this.activeYear = year;
        }
        break;
      }
      runningIndex += count;
    }
  }

  scrollToYear(year: string): void {
    this.activeYear = year;
    let targetIndex = 0;
    for (const y of this.years) {
      if (y === year) break;
      targetIndex +=
        this.activeTab === 'all'
          ? (this.projects.architecture[y]?.length || 0) +
            (this.projects.interior[y]?.length || 0)
          : this.projects[this.activeTab]?.[y]?.length || 0;
    }
    const strip = this.imageStripRef.nativeElement as HTMLElement;
    const imageEls = strip.querySelectorAll('img');
    if (!imageEls.length) return;
    const imageWidth = imageEls[0].offsetWidth + 16;
    const scrollTo = targetIndex * imageWidth;
    strip.scrollTo({ left: scrollTo, behavior: 'smooth' });
  }

  onImageClick(img: string): void {
    const updated = document.getElementById(
      'timeline-image-updated'
    ) as HTMLImageElement;
    if (updated) {
      updated.src = img;
    }
  }
}
