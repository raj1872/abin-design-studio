import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent implements OnInit, OnDestroy {
  currentYear: number = new Date().getFullYear();
  isCreditsPage = false;
  private routerSub!: Subscription;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.checkPageType(this.router.url);

    this.routerSub = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.checkPageType(event.urlAfterRedirects);
      });
  }

  ngOnDestroy(): void {
    if (this.routerSub) {
      this.routerSub.unsubscribe();
    }
  }

  private checkPageType(url: string): void {
    this.isCreditsPage = /^\/site-credits(\/|$)/.test(url);
    // console.log('isCreditsPage:', this.isCreditsPage, 'url:', url);
  }
}
