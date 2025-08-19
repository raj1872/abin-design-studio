import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
})
export class ContactComponent implements OnInit {
  contactInfo: any;
  address: string = '';
  addressLink: string = '';
  whatsappLink: string = '';
  instagramLink: string = '';
  email: string = '';
  phone: string = '';

  constructor(
    private apiService: ApiService,
    private meta: Meta,
    private titleService: Title
  ) {}

  ngOnInit(): void {
    this.apiService.getContactInfo().subscribe({
      next: (res) => {
        if (res && res.data) {
          this.contactInfo = res.data;

          // Extract details
          this.addressLink =
            res.data.address_link?.trim() ||
            'https://maps.app.goo.gl/DfwBigGrbSbFzM749';
          this.whatsappLink = res.data.whatsapp_link;
          this.instagramLink = res.data.instagram?.trim();
          this.email = res.data.emails?.[0]?.email;
          this.phone = res.data.contacts?.[0]?.contact_no_full;

          // Convert address to include line breaks for mobile
          this.address = this.formatAddress(res.data.address);

          // Set SEO meta tags
          this.titleService.setTitle('Contact Us | ABIN Design Studio');
          this.meta.updateTag({
            name: 'description',
            content: `Get in touch with ABIN Design Studio. Contact us via phone, email, WhatsApp or visit us at ${res.data.address}.`,
          });
          this.meta.updateTag({
            name: 'keywords',
            content: 'ABIN Design Studio, contact, phone, email, Instagram, WhatsApp, Kolkata',
          });
        }
      },
      error: (err) => console.error('Error fetching contact info', err),
    });
  }

  // Helper to add <br> after commas for mobile line breaks
  private formatAddress(address: string): string {
    if (!address) return '';
    return address.replace(/,\s*/g, ',<br class="hide-tab-mobile">');
  }
}
