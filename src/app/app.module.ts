import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { SwiperModule } from 'swiper/angular';
import { FancyboxDirective } from './directives/fancybox.directive';
import { AppComponent } from './app.component';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { FullPageLoaderComponent } from './core/full-page-loader/full-page-loader.component';
import { HomeComponent } from './pages/home/home.component';
import { ProjectsComponent } from './pages/projects/projects.component';
import { ProjectDetailComponent } from './pages/project-detail/project-detail.component';
import { LandingComponent } from './pages/landing/landing.component';
import { PublicationsComponent } from './pages/publications/publications.component';
import { NewsComponent } from './pages/news/news.component';
import { NewsDetailComponent } from './pages/news-detail/news-detail.component';
import { OurStudioComponent } from './pages/our-studio/our-studio.component';
import { ContactComponent } from './pages/contact/contact.component';
import { CareerComponent } from './pages/career/career.component';

@NgModule({
  declarations: [
    AppComponent,
    FancyboxDirective,
    HeaderComponent,
    FooterComponent,
    FullPageLoaderComponent,
    PublicationsComponent,
    LandingComponent,
    NewsComponent,
    NewsDetailComponent,
    ContactComponent,
    CareerComponent,
    OurStudioComponent,
    HomeComponent,
    ProjectsComponent,
    ProjectDetailComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }), // ✅ SSR safe
    RouterModule,
    SwiperModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
