import { Component, OnInit, Inject, PLATFORM_ID, OnDestroy } from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-full-page-loader',
  templateUrl: './full-page-loader.component.html',
  styleUrls: ['./full-page-loader.component.css']
})
export class FullPageLoaderComponent implements OnInit, OnDestroy {
  showLoader = false;
  private isBrowser: boolean;

  words: string[] = [];

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      // Split into words instead of letters
      this.words = 'Soul In The Shell'.split('').map(ch => ch === ' ' ? '\u00A0' : ch);

      this.showLoader = true;
      this.document.body.style.overflow = 'hidden';

      // Hide loader after fade + slide
      setTimeout(() => {
        this.showLoader = false;
        this.document.body.style.overflow = '';
      }, 4000);
    }
  }

  ngOnDestroy(): void {
    if (this.isBrowser) {
      this.document.body.style.overflow = '';
    }
  }
}
