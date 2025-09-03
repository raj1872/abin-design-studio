import {
  Component,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'],
})
export class LandingComponent implements AfterViewInit, OnDestroy {
  @ViewChild('landingWrapper', { static: true }) landingWrapper!: ElementRef;
  words: string[] = [];
  private lenis!: Lenis;
  private animationFrame!: number;
  private isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: Document,
    private el: ElementRef
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  
  ngOnInit(): void {
    if (this.isBrowser) {
      this.words = 'Soul In The Shell'.split('').map(ch => ch === ' ' ? '\u00A0' : ch);
    }
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return; // ⬅️ Prevent running in SSR

    this.lenis = new Lenis({
      wrapper: this.landingWrapper.nativeElement,
      content: this.landingWrapper.nativeElement,
      duration: 1.2,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      wheelMultiplier: 2,
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    const raf = (time: number) => {
      this.lenis.raf(time);
      this.animationFrame = requestAnimationFrame(raf);
    };
    this.animationFrame = requestAnimationFrame(raf);

    const scroller = this.document.querySelector('.landingpage-wrapper'); // 👈 your custom scroll container
    const letters: NodeListOf<HTMLElement> = this.el.nativeElement.querySelectorAll('.loader-letter');
    const overlay = this.el.nativeElement.querySelector('.loader-overlay');

    gsap.set(letters, {
      x: () => gsap.utils.random(-window.innerWidth / 5, window.innerWidth / 5),
      y: () => gsap.utils.random(-window.innerHeight / 5, window.innerHeight / 5),
      rotation: () => gsap.utils.random(-270, 180), // 👈 random tilt
      opacity: 1
    });

    gsap.to(letters, {
      x: 0,
      y: 0,
      rotation: 0,      
      ease: "power3.out",
      stagger: 0.05,
      scrollTrigger: {
        trigger: this.el.nativeElement.querySelector('.loader-overlay'),
        scroller: scroller,
        start: "top top",
        end: "center end",
        scrub: true
      }
    });

    gsap.to(overlay, {
      filter: "blur(0px)",
      ease: "none",
      scrollTrigger: {
        trigger: overlay,
        scroller: scroller,
        start: "top top",
        end: "center end",
        scrub: true
      }
    });
  }

  /**
   * Scroll to the second landing section using Lenis if available,
   * fallback to native smooth scroll otherwise.
   */
  onExploreClick(): void {
    if (!this.isBrowser) return;

    const target = this.document.getElementById('abin-design-studio-landing-2');
    if (target) {
      if (this.lenis) {
        this.lenis.scrollTo(target, { offset: 0 });
      } else {
        try {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } catch {
          target.scrollIntoView();
        }
      }
    }
  }

  ngOnDestroy(): void {
    if (!this.isBrowser) return;
    cancelAnimationFrame(this.animationFrame);
    if (this.lenis) {
      this.lenis.destroy();
    }
  }
}
