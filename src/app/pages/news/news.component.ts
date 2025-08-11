import { Component, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

interface NewsItem {
  title: string;
  category: string;
  date: string;
  description: string;
  image: string;
}

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css'],
})
export class NewsComponent implements OnInit {
  isBrowser = false;
  isMobile = false;
  dropdownOpen = false;
  categories = ['All', 'Awards', 'Publications', 'Project Updates'];
  activeCategory = 'All';

  newsList: NewsItem[] = [
    // --- Awards ---
    {
      title: 'Sky Tower Wins Best Architectural Design 2025',
      category: 'Awards',
      date: '2025-07-15',
      description:
        'Recognized for innovative green architecture and design excellence.',
      image: 'https://dummyimage.com/600x600/DEDEDE/DEDEDE',
    },
    {
      title: 'New City Library Receives International Award',
      category: 'Awards',
      date: '2025-05-10',
      description: 'Honored for outstanding public space design.',
      image: 'https://dummyimage.com/600x600/DEDEDE/DEDEDE',
    },
    {
      title: 'Urban Bridge Pavilion Wins Best Infrastructure Award',
      category: 'Awards',
      date: '2025-04-02',
      description:
        'Praised for its unique design and pedestrian-friendly planning.',
      image: 'https://dummyimage.com/600x600/DEDEDE/DEDEDE',
    },
    {
      title: 'Green Heights Receives Sustainable Architecture Recognition',
      category: 'Awards',
      date: '2025-06-18',
      description:
        'Awarded for pioneering use of renewable energy in high-rises.',
      image: 'https://dummyimage.com/600x600/DEDEDE/DEDEDE',
    },
    {
      title: 'Harborfront Cultural Center Wins Global Design Prize',
      category: 'Awards',
      date: '2025-08-02',
      description:
        'Recognized for blending modern design with historical context.',
      image: 'https://dummyimage.com/600x600/DEDEDE/DEDEDE',
    },

    // --- Publications ---
    {
      title: 'Sustainable Urban Spaces Featured in ArchiWorld Magazine',
      category: 'Publications',
      date: '2025-06-20',
      description:
        'An in-depth article on urban design strategies for future cities.',
      image: 'https://dummyimage.com/600x600/DEDEDE/DEDEDE',
    },
    {
      title: 'Modern Minimalist Homes in Architect Digest',
      category: 'Publications',
      date: '2025-05-15',
      description:
        'Highlighting clean lines and functional design in residential spaces.',
      image: 'https://dummyimage.com/600x600/DEDEDE/DEDEDE',
    },
    {
      title: 'The Rise of Timber Skyscrapers in Design Weekly',
      category: 'Publications',
      date: '2025-04-28',
      description:
        'Exploring the future of sustainable high-rise construction.',
      image: 'https://dummyimage.com/600x600/DEDEDE/DEDEDE',
    },
    {
      title: 'Architectural Innovations in Coastal Protection',
      category: 'Publications',
      date: '2025-07-10',
      description:
        'Discussing structures designed to withstand rising sea levels.',
      image: 'https://dummyimage.com/600x600/DEDEDE/DEDEDE',
    },
    {
      title: 'Reviving Heritage: Old Meets New',
      category: 'Publications',
      date: '2025-08-03',
      description:
        'Case studies on blending historical preservation with modern architecture.',
      image: 'https://dummyimage.com/600x600/DEDEDE/DEDEDE',
    },

    // --- Project Updates ---
    {
      title: 'Foundation Work Completed for Oceanview Residences',
      category: 'Project Updates',
      date: '2025-08-05',
      description: 'Structural foundation completed ahead of schedule.',
      image: 'https://dummyimage.com/600x600/DEDEDE/DEDEDE',
    },
    {
      title: 'Downtown Plaza Landscaping Begins',
      category: 'Project Updates',
      date: '2025-06-14',
      description: 'Green spaces and public seating areas under development.',
      image: 'https://dummyimage.com/600x600/DEDEDE/DEDEDE',
    },
    {
      title: 'Riverside Walkway Opens for Public Access',
      category: 'Project Updates',
      date: '2025-05-30',
      description: 'Features new pedestrian paths and viewing decks.',
      image: 'https://dummyimage.com/600x600/DEDEDE/DEDEDE',
    },
    {
      title: 'Harbor Tower Glass Facade Installation Near Completion',
      category: 'Project Updates',
      date: '2025-08-09',
      description:
        'Custom glass panels designed for maximum energy efficiency.',
      image: 'https://dummyimage.com/600x600/DEDEDE/DEDEDE',
    },
  ];

  filteredNews: NewsItem[] = [];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    this.isBrowser = isPlatformBrowser(this.platformId);

    if (this.isBrowser) {
      this.checkMobile();
      window.addEventListener('resize', () => this.checkMobile());
    }

    this.filterNews();
  }

  checkMobile() {
    this.isMobile = window.innerWidth <= 768;
  }

  setActiveCategory(category: string, event?: Event) {
    if (event) {
      event.stopPropagation(); // Prevent parent event interference
    }
    this.activeCategory = category;
    this.filterNews();
  }

  filterNews() {
    if (this.activeCategory === 'All') {
      // Copy array before shuffling so original order remains intact
      this.filteredNews = [...this.newsList];
      this.shuffleArray(this.filteredNews);
    } else {
      this.filteredNews = this.newsList.filter(
        (news) => news.category === this.activeCategory
      );
    }
  }

  private shuffleArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
}
