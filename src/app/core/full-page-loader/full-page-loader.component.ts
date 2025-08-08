import { Component, OnInit, Inject, PLATFORM_ID, OnDestroy } from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-full-page-loader',
  templateUrl: './full-page-loader.component.html',
  styleUrls: ['./full-page-loader.component.css']
})
export class FullPageLoaderComponent implements OnInit, OnDestroy {
  showLoader = true;
  private isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      // Disable body scroll
      this.document.body.style.overflow = 'hidden';

      // Match total animation time (stroke + fill)
      setTimeout(() => {
        this.showLoader = false;

        // Restore scrolling
        this.document.body.style.overflow = '';
      }, 100); // 2s stroke + 1s fill
      // }, 3000); // 2s stroke + 1s fill
    }
  }

  ngOnDestroy(): void {
    // Ensure scroll is restored if component is destroyed early
    if (this.isBrowser) {
      this.document.body.style.overflow = '';
    }
  }
}
