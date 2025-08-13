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
import { ApiService } from '../../services/api.service'; // 👈 adjust path as needed

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.css'],
})
export class ProjectDetailComponent implements OnInit, AfterViewInit {
  
  @ViewChild('parallaxBg', { static: true }) parallaxBg!: ElementRef;
  @ViewChildren('autoVideo', { read: ElementRef }) autoVideos!: QueryList<
    ElementRef<HTMLVideoElement>
  >;
  @ViewChildren('scalableImage', { read: ElementRef })
  scalableImages!: QueryList<ElementRef>;

  isBrowser = false;

  // ===== Popup state flags =====
  isCreditOpen = false;
  isInnerPopupActive = false;
  isPublicationOpen = false;
  isOverlayActive = false;

  // top offset used for fixed-position popup
  sectionTop = 0;

  private wordSpans: NodeListOf<HTMLSpanElement> = [] as any;
  private totalSpans = 0;
  private container: HTMLElement | null = null;

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

    // ✅ Get slug from route and fetch details
    this.route.paramMap.subscribe((params) => {
      const slug = params.get('slug');
      if (slug) {
        this.fetchProjectDetail(slug);
      }
    });
  }

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      this.onScroll();
      // this.setupWordRevealEffect();

      import('aos').then((AOS: any) => {
        AOS.init({
          duration: 800,
          easing: 'ease-in-out',
          once: true,
        });
      });
      // Initial setup
      this.setupVideoAutoplay();

      // Handle any new videos added later (e.g., *ngIf)
      this.autoVideos.changes.subscribe(() => {
        this.setupVideoAutoplay();
      });
    }
  }

  private setupVideoAutoplay(): void {
    if (!this.autoVideos || this.autoVideos.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const videoEl = entry.target as HTMLVideoElement;
          if (entry.isIntersecting) {
            // Ensure proper iOS Safari autoplay
            videoEl.muted = true;
            videoEl.playsInline = true;
            videoEl.loop = true;
            videoEl.load(); // reload video
            videoEl
              .play()
              .then(() => console.log('Video playing:', videoEl.src))
              .catch((err) =>
                console.warn('Video play blocked:', videoEl.src, err)
              );
          } else {
            videoEl.pause();
            console.log('Video paused:', videoEl.src);
          }
        });
      },
      { threshold: 0.5 } // play when 50% visible
    );

    // Observe all videos
    this.autoVideos.forEach((videoRef) => {
      observer.observe(videoRef.nativeElement);
    });
  }

  projectDetailObj: any = {};
  loading = true;

  bannerImageUrl: string = '';

  private fetchProjectDetail(slug: string) {
    this.loading = true;
    this.apiService.getProjectBySlug(slug).subscribe({
      next: (res: any) => {
        const projectData =
          Array.isArray(res?.list) && res.list.length ? res.list[0] : res || {};
        this.projectDetailObj = {
          ...projectData,
          sections: projectData?.sections || [],
        };

        // ✅ Preserve order of sections exactly as API gives
        // We can later *ngFor directly in HTML using projectDetailObj.sections

        // ✅ Optional: pick banner image if exists
        const bannerSection = this.projectDetailObj.sections.find(
          (section: any) => section.type === 'banner-block'
        );
        if (bannerSection?.content?.image_view) {
          this.bannerImageUrl = bannerSection.content.image_view;
        }

        // Wait for DOM update before running word reveal
        setTimeout(() => {
          if (this.isBrowser) {
            this.setupWordRevealEffect();
          }
        }, 0);

        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error fetching project detail:', err);
        this.loading = false;
      },
    });
  }

  private updateSectionTop(): void {
    if (!this.isBrowser) return;
    const section = document.getElementById(
      'abin-design-studio-project-detail-2'
    );
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

    if (this.parallaxBg?.nativeElement) {
      this.parallaxBg.nativeElement.style.transform = `translate3d(0, ${offset}px, 0)`;
    }

    this.updateWordRevealEffect();

    this.scalableImages?.forEach((imgRef: ElementRef) => {
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
    this.isOverlayActive = true;
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
    if (!this.isBrowser) return; // ✅ Prevents SSR crash

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
