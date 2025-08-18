import {
  Component,
  ElementRef,
  Inject,
  PLATFORM_ID,
  HostListener,
  OnInit,
  ViewChildren,
  QueryList,
  AfterViewInit,
  ViewChild,
  Renderer2,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.css'],
})
export class ProjectDetailComponent implements OnInit, AfterViewInit {
  @ViewChild('parallaxBg', { static: false }) parallaxBg!: ElementRef;
  @ViewChildren('autoVideo', { read: ElementRef }) autoVideos!: QueryList<ElementRef<HTMLVideoElement>>;
  @ViewChildren('scalableImage', { read: ElementRef }) scalableImages!: QueryList<ElementRef>;

  isBrowser = false;

  // ===== Popup state flags =====
  isCreditOpen = false;
  isInnerPopupActive = false;
  isPublicationOpen = false;
  isOverlayActive = false;

  sectionTop = 0;

  private wordSpans: NodeListOf<HTMLSpanElement> = [] as any;
  private totalSpans = 0;
  private container: HTMLElement | null = null;

  projectDetailObj: any = {};
  loading = true;
  bannerImageUrl: string = '';

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private renderer: Renderer2,
    private route: ActivatedRoute,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.isBrowser = isPlatformBrowser(this.platformId);

    if (this.isBrowser) {
      this.updateSectionTop();
    }

    this.route.paramMap.subscribe((params) => {
      const slug = params.get('slug');
      if (slug) {
        this.fetchProjectDetail(slug);
      }
    });
  }

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      this.initScrollEffects();
    }
  }

  // ========= Centralized initialization =========
  private initScrollEffects(): void {
    if (!this.isBrowser) return;

    this.setupWordRevealEffect();
    this.setupVideoAutoplay();

    this.autoVideos.changes.subscribe(() => {
      this.setupVideoAutoplay();
    });

    import('aos').then((AOS: any) => {
      AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
      });
      AOS.refresh();
    });

    this.onScroll();
  }

  private setupVideoAutoplay(): void {
    if (!this.autoVideos || this.autoVideos.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const videoEl = entry.target as HTMLVideoElement;
          if (entry.isIntersecting) {
            videoEl.muted = true;
            videoEl.playsInline = true;
            videoEl.loop = true;
            videoEl.load();
            videoEl.play().catch(() => {});
          } else {
            videoEl.pause();
          }
        });
      },
      { threshold: 0.5 }
    );

    this.autoVideos.forEach((videoRef) => {
      observer.observe(videoRef.nativeElement);
    });
  }

  private fetchProjectDetail(slug: string) {
    this.loading = true;
    const minLoadingTime = 1500;
    const startTime = Date.now();

    this.apiService.getProjectBySlug(slug).subscribe({
      next: (res: any) => {
        const projectData = Array.isArray(res?.list) && res.list.length ? res.list[0] : res || {};
        this.projectDetailObj = {
          ...projectData,
          sections: projectData?.sections || [],
        };

        const bannerSection = this.projectDetailObj.sections.find(
          (section: any) => section.type === 'banner-block'
        );
        if (bannerSection?.content?.image_view) {
          this.bannerImageUrl = bannerSection.content.image_view;
        }

        if (this.isBrowser) {
          const imageUrls: string[] = [];
          this.projectDetailObj.sections.forEach((section: any) => {
            if (section.content?.image_view) {
              imageUrls.push(section.content.image_view);
            }
          });

          const finishLoading = () => {
            const elapsed = Date.now() - startTime;
            const remaining = minLoadingTime - elapsed;

            setTimeout(() => {
              this.loading = false;
              setTimeout(() => this.initScrollEffects());
            }, remaining > 0 ? remaining : 0);
          };

          if (imageUrls.length > 0) {
            let loadedCount = 0;
            imageUrls.forEach((url) => {
              const img = new window.Image();
              img.src = url;
              img.onload = img.onerror = () => {
                loadedCount++;
                if (loadedCount === imageUrls.length) {
                  finishLoading();
                }
              };
            });
          } else {
            finishLoading();
          }
        } else {
          this.loading = false;
        }
      },
      error: (err: any) => {
        console.error('Error fetching project detail:', err);
        this.loading = false;
      },
    });
  }

  private updateSectionTop(): void {
    if (!this.isBrowser) return;
    const section = document.getElementById('abin-design-studio-project-detail-2');
    if (!section) return;
    const rect = section.getBoundingClientRect();
    const top = Math.max(0, Math.round(rect.top));
    this.sectionTop = top;
  }

  @HostListener('window:resize', [])
  onResize(): void {
    if (!this.isBrowser) return;
    this.updateSectionTop();
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    if (!this.isBrowser) return;

    if (this.isCreditOpen) {
      this.updateSectionTop();
    }

    const scrollTop = window.scrollY;
    const isMobile = window.innerWidth <= 768;
    const parallaxSpeed = isMobile ? 0.4 : 0.4;
    const offset = scrollTop * parallaxSpeed;

    if (this.parallaxBg && this.parallaxBg.nativeElement) {
      this.parallaxBg.nativeElement.style.transform = `translate3d(0, ${offset}px, 0)`;
    }

    this.updateWordRevealEffect();
    this.applyScalableImages();
  }

  private applyScalableImages(): void {
    if (!this.scalableImages) return;

    this.scalableImages.forEach((imgRef: ElementRef) => {
      const imgEl = imgRef.nativeElement as HTMLElement;
      const rect = imgEl.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;

      if (inView) {
        const progress =
          1 -
          Math.abs(
            (rect.top + rect.height / 2 - window.innerHeight / 2) /
              (window.innerHeight / 2)
          );
        const scale = 1 + Math.max(0, Math.min(0.05, progress * 0.05));
        imgEl.style.transform = `scale(${scale})`;
      } else {
        imgEl.style.transform = 'scale(1)';
      }
    });
  }

  // ===== Popup Methods =====
  openCredits() {
    if (this.isCreditOpen) return;
    this.closeAll();
    if (this.isBrowser) {
      this.updateSectionTop();
    }
    this.isCreditOpen = true;
    // this.isOverlayActive = true;
    setTimeout(() => {
      this.isInnerPopupActive = true;
    }, 1000);
  }

  openPublication() {
    if (this.isPublicationOpen) return;
    this.closeAll();
    this.isPublicationOpen = true;
    this.isOverlayActive = true;
  }

  closeAll() {
    this.isCreditOpen = false;
    this.isInnerPopupActive = false;
    this.isPublicationOpen = false;
    this.isOverlayActive = false;
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscKey() {
    this.closeAll();
  }

  setupWordRevealEffect(): void {
    if (!this.isBrowser) return;

    this.container = document.getElementById('scroll-reveal-text');
    if (!this.container || this.container.classList.contains('words-enhanced'))
      return;

    const words = this.container.textContent?.trim().split(' ') || [];
    this.container.innerHTML = '';

    words.forEach((word) => {
      const span = document.createElement('span');
      span.textContent = word + ' ';
      span.style.opacity = '0.05';
      span.style.transition = 'opacity 0.3s ease';
      span.style.display = 'inline-block';
      span.style.wordBreak = 'break-word';
      this.container!.appendChild(span);
    });

    this.container.classList.add('words-enhanced');
    this.wordSpans = this.container.querySelectorAll('span');
    this.totalSpans = this.wordSpans.length;

    this.updateWordRevealEffect();
  }

  updateWordRevealEffect(): void {
    if (!this.container || this.wordSpans.length === 0) return;

    const rect = this.container.getBoundingClientRect();
    if (rect.top <= window.innerHeight && rect.bottom >= 0) {
      const scrollTop = window.scrollY;
      const elementStart = scrollTop + rect.top;
      const scrollDistance = scrollTop - (elementStart - window.innerHeight);
      const vhMultiplier = window.innerWidth < 768 ? 1.15 : 0.75;
      const revealRange = window.innerHeight * vhMultiplier;
      const revealStep = revealRange / this.totalSpans;

      this.wordSpans.forEach((span, index) => {
        const revealPoint = index * revealStep;
        span.style.opacity = scrollDistance >= revealPoint ? '1' : '0.05';
      });
    } else {
      this.wordSpans.forEach((span) => (span.style.opacity = '0.05'));
    }
  }
}
