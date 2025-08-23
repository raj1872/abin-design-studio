import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { DomSanitizer, SafeResourceUrl, SafeHtml } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

/**
 * Pipe for sanitizing URLs (used in iframe for PDF viewer)
 */
@Pipe({
  name: 'safeUrl',
  standalone: true, // ✅ no module needed
})
export class SafeUrlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}

/**
 * Pipe for sanitizing HTML (used for publication descriptions)
 */
@Pipe({
  name: 'safeHtml',
  standalone: true,
})
export class SafeHtmlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }
}

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css'],
  standalone: true, // ✅ make component standalone
  imports: [CommonModule, RouterModule, SafeUrlPipe, SafeHtmlPipe], // ✅ added SafeHtmlPipe
})
export class DetailComponent implements OnInit {
  publication: any;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');

    if (slug) {
      this.apiService.getPublicationsDetails(slug).subscribe({
        next: (res) => {
          if (res?.list?.length > 0) {
            this.publication = res.list[0];
          }
          console.log('Publication Detail:', this.publication);
        },
        error: (err) =>
          console.error('Error fetching publication detail:', err),
      });
    }
  }
}
