import { Component, OnInit, Inject, PLATFORM_ID, ElementRef, AfterViewInit } from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-full-page-loader',
  templateUrl: './full-page-loader.component.html',
  styleUrls: ['./full-page-loader.component.css']
})
export class FullPageLoaderComponent implements OnInit, AfterViewInit {
  words: string[] = [];
  private isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    @Inject(DOCUMENT) private document: Document,
    private el: ElementRef
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.words = 'Soul In The Shell'.split('').map(ch => ch === ' ' ? '\u00A0' : ch);
    }
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;

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
      rotation: 0,             // 👈 reset to normal
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


}
