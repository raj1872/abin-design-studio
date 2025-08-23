import { Component, AfterViewInit, Inject, PLATFORM_ID, OnInit, HostListener } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ApiService } from '../../services/api.service';
import Lenis from '@studio-freight/lenis';

@Component({
  selector: 'app-publications',
  templateUrl: './publications.component.html',
  styleUrls: ['./publications.component.css']
})
export class PublicationsComponent implements OnInit, AfterViewInit {
  isMobile = false;
  publications: any[] = [];

   constructor(
      @Inject(PLATFORM_ID) private platformId: Object,
      private apiService: ApiService
    ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.checkIsMobile();
      this.apiService.getPublications().subscribe({
        next: (res) => {
          this.publications = res.list || res;
          console.log(this.publications);
        },
        error: (err) => console.error('Error fetching publications:', err)
      });
    }
    // ✅ Call publications API globally (SSR + Browser safe)
  }

  @HostListener('window:resize')
  onResize() {
    this.checkIsMobile();
  }

  private checkIsMobile(): void {
    this.isMobile = window.innerWidth <= 991;
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId) && !this.isMobile) {
      const wrapper = document.querySelector('.publications-horizontal-scroll-wrapper') as HTMLElement;
      if (!wrapper) return;

      const lenis = new Lenis({
        orientation: 'horizontal',
        gestureOrientation: 'both',
        wrapper,
        content: wrapper,
        lerp: 0.1,
        wheelMultiplier: 1
      });

      const raf = (time: number) => {
        lenis.raf(time);
        requestAnimationFrame(raf);
      };
      requestAnimationFrame(raf);

      // Optional: Auto scroll to the first snap point after load
      // setTimeout(() => {
      //   this.snapToCard(lenis, wrapper, 0); // 0 means first card
      // }, 5000);

      // Listen for scroll end to snap automatically
      // let scrollTimeout: any;
      // wrapper.addEventListener('scroll', () => {
      //   clearTimeout(scrollTimeout);
      //   scrollTimeout = setTimeout(() => {
      //     this.snapToNearestCard(lenis, wrapper);
      //   }, 150);
      // });
    }
  }

  private snapToCard(lenis: Lenis, wrapper: HTMLElement, index: number) {
    const card = wrapper.querySelectorAll('.publications-card-list')[index] as HTMLElement;
    if (card) {
      lenis.scrollTo(card, { duration: 1 });
    }
  }

  private snapToNearestCard(lenis: Lenis, wrapper: HTMLElement) {
    const cards = Array.from(wrapper.querySelectorAll('.publications-card-list')) as HTMLElement[];
    const wrapperCenter = wrapper.scrollLeft + wrapper.clientWidth / 2;

    let nearestCard: HTMLElement | null = null;
    let minDistance = Infinity;

    for (const card of cards) {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const distance = Math.abs(wrapperCenter - cardCenter);
      if (distance < minDistance) {
        minDistance = distance;
        nearestCard = card;
      }
    }

    if (nearestCard) {
      lenis.scrollTo(nearestCard, { duration: 0.8 });
    }
  }
}
