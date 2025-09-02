import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-site-credits',
  templateUrl: './site-credits.component.html',
  styleUrls: ['./site-credits.component.css']
})
export class SiteCreditsComponent {

  constructor(@Inject(PLATFORM_ID) private platformId: Object,) {
    if (!isPlatformBrowser(this.platformId)) return;

    // document.body.style.backgroundColor = "#000000";
  }

  ngOnInit(): void {

  }

}
