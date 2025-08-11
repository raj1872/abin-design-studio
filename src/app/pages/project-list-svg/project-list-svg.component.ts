import { Component, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-project-list-svg',
  templateUrl: './project-list-svg.component.html',
  styleUrls: ['./project-list-svg.component.css']
})
export class ProjectListSvgComponent implements OnInit {
  private isBrowser = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      // ✅ Browser-only logic goes here
      // Example: console.log(window.innerWidth);
    }
  }
}
