// RSS Feed Integration for NC State Sports News
// Using https://www.backingthepack.com/rss/current.xml

import { XMLParser } from 'fast-xml-parser';

export interface RSSArticle {
  id: string;
  title: string;
  description: string;
  link: string;
  pubDate: string;
  author?: string;
  category?: string[];
  guid: string;
  content?: string;
  imageUrl?: string;
}

export interface RSSFeed {
  title: string;
  description: string;
  link: string;
  lastBuildDate: string;
  items: RSSArticle[];
}

class RSSFeedService {
  private cache = new Map<string, { data: RSSFeed; timestamp: number }>();
  private readonly CACHE_TTL = 10 * 60 * 1000; // 10 minutes for news
  private readonly parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
    parseAttributeValue: true,
    trimValues: true,
  });

  /**
   * Get cached RSS data or return null if expired
   */
  private getCachedData(url: string): RSSFeed | null {
    const cached = this.cache.get(url);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.data;
    }
    this.cache.delete(url);
    return null;
  }

  /**
   * Set RSS data in cache with timestamp
   */
  private setCachedData(url: string, data: RSSFeed): void {
    this.cache.set(url, { data, timestamp: Date.now() });
  }

  /**
   * Parse RSS XML content into structured data
   */
  private parseRSSContent(xmlContent: string): RSSFeed {
    try {
      const parsed = this.parser.parse(xmlContent);
      const channel = parsed.rss?.channel || parsed.feed;

      if (!channel) {
        throw new Error('Invalid RSS feed structure');
      }

      const items = Array.isArray(channel.item) ? channel.item : [channel.item].filter(Boolean);
      
      const articles: RSSArticle[] = items.map((item: any, index: number) => {
        // Extract image from description or content
        const description = item.description || item.summary || '';
        const imageMatch = description.match(/<img[^>]+src="([^"]+)"/i);
        const imageUrl = imageMatch ? imageMatch[1] : null;
        
        // Clean description of HTML tags
        const cleanDescription = description.replace(/<[^>]*>/g, '').trim();
        
        // Handle categories
        const categories = item.category 
          ? Array.isArray(item.category) 
            ? item.category.map((cat: any) => typeof cat === 'string' ? cat : cat['#text'] || cat)
            : [typeof item.category === 'string' ? item.category : item.category['#text'] || item.category]
          : [];

        return {
          id: item.guid?.['#text'] || item.guid || item.id || `item-${index}`,
          title: item.title || 'Untitled',
          description: cleanDescription,
          link: item.link?.['@_href'] || item.link || '',
          pubDate: item.pubDate || item.published || new Date().toISOString(),
          author: item.author?.name || item.author || item['dc:creator'] || 'Unknown',
          category: categories,
          guid: item.guid?.['#text'] || item.guid || `guid-${index}`,
          content: item['content:encoded'] || item.content || cleanDescription,
          imageUrl: imageUrl || undefined,
        };
      });

      return {
        title: channel.title || 'RSS Feed',
        description: channel.description || '',
        link: channel.link?.['@_href'] || channel.link || '',
        lastBuildDate: channel.lastBuildDate || channel.updated || new Date().toISOString(),
        items: articles,
      };
    } catch (error) {
      console.error('Failed to parse RSS content:', error);
      throw new Error('Invalid RSS feed format');
    }
  }

  /**
   * Fetch and parse RSS feed from URL
   */
  async fetchRSSFeed(url: string): Promise<RSSFeed> {
    // Check cache first
    const cached = this.getCachedData(url);
    if (cached) {
      return cached;
    }

    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'NC State Sports Hub/1.0',
          'Accept': 'application/rss+xml, application/xml, text/xml',
        },
      });

      if (!response.ok) {
        throw new Error(`RSS fetch error: ${response.status} ${response.statusText}`);
      }

      const xmlContent = await response.text();
      const feedData = this.parseRSSContent(xmlContent);
      
      // Cache the parsed data
      this.setCachedData(url, feedData);
      
      return feedData;
    } catch (error) {
      console.error('Failed to fetch RSS feed:', error);
      throw new Error(`Failed to fetch RSS feed from ${url}`);
    }
  }

  /**
   * Get latest NC State news from Backing the Pack
   */
  async getBackingThePackNews(): Promise<RSSArticle[]> {
    const rssUrl = 'https://www.backingthepack.com/rss/current.xml';
    
    try {
      const feed = await this.fetchRSSFeed(rssUrl);
      return feed.items;
    } catch (error) {
      console.error('Failed to fetch Backing the Pack news:', error);
      return [];
    }
  }

  /**
   * Get latest news with limit
   */
  async getLatestNews(limit: number = 10): Promise<RSSArticle[]> {
    const articles = await this.getBackingThePackNews();
    return articles.slice(0, limit);
  }

  /**
   * Search articles by keyword
   */
  async searchNews(keyword: string): Promise<RSSArticle[]> {
    const articles = await this.getBackingThePackNews();
    const searchTerm = keyword.toLowerCase();
    
    return articles.filter(article => 
      article.title.toLowerCase().includes(searchTerm) ||
      article.description.toLowerCase().includes(searchTerm) ||
      article.category?.some(cat => cat.toLowerCase().includes(searchTerm))
    );
  }

  /**
   * Get articles by category
   */
  async getNewsByCategory(category: string): Promise<RSSArticle[]> {
    const articles = await this.getBackingThePackNews();
    const categoryLower = category.toLowerCase();
    
    return articles.filter(article =>
      article.category?.some(cat => cat.toLowerCase().includes(categoryLower))
    );
  }

  /**
   * Get articles from the last N days
   */
  async getRecentNews(days: number = 7): Promise<RSSArticle[]> {
    const articles = await this.getBackingThePackNews();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return articles.filter(article => {
      const articleDate = new Date(article.pubDate);
      return articleDate >= cutoffDate;
    });
  }

  /**
   * Get featured/trending articles (most recent)
   */
  async getFeaturedNews(): Promise<RSSArticle[]> {
    const articles = await this.getBackingThePackNews();
    
    // Return the 5 most recent articles as featured
    return articles.slice(0, 5);
  }

  /**
   * Get articles for specific sports keywords
   */
  async getSportsNews(sport: string): Promise<RSSArticle[]> {
    const articles = await this.getBackingThePackNews();
    const sportKeywords = {
      basketball: ['basketball', 'hoops', 'court', 'ncaam'],
      football: ['football', 'gridiron', 'touchdown', 'ncaaf'],
      baseball: ['baseball', 'diamond', 'home run', 'ncaab'],
      recruiting: ['recruit', 'commitment', 'transfer', 'portal'],
    };

    const keywords = sportKeywords[sport.toLowerCase() as keyof typeof sportKeywords] || [sport.toLowerCase()];
    
    return articles.filter(article => {
      const content = `${article.title} ${article.description}`.toLowerCase();
      return keywords.some(keyword => content.includes(keyword));
    });
  }

  /**
   * Combine multiple RSS feeds
   */
  async getCombinedNews(urls: string[], limit: number = 20): Promise<RSSArticle[]> {
    try {
      const feedPromises = urls.map(url => this.fetchRSSFeed(url));
      const feeds = await Promise.allSettled(feedPromises);
      
      const allArticles: RSSArticle[] = [];
      
      feeds.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          allArticles.push(...result.value.items);
        } else {
          console.error(`Failed to fetch feed ${urls[index]}:`, result.reason);
        }
      });
      
      // Sort by publication date (newest first)
      allArticles.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
      
      return allArticles.slice(0, limit);
    } catch (error) {
      console.error('Failed to fetch combined news:', error);
      return [];
    }
  }

  /**
   * Get RSS feed metadata
   */
  async getFeedInfo(url: string): Promise<{ title: string; description: string; link: string; lastBuildDate: string }> {
    const feed = await this.fetchRSSFeed(url);
    return {
      title: feed.title,
      description: feed.description,
      link: feed.link,
      lastBuildDate: feed.lastBuildDate,
    };
  }
}

// Export singleton instance
export const rssService = new RSSFeedService();
export default rssService;