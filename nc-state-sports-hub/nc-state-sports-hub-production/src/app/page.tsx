// @ts-nocheck
import { espnAPI } from '../lib/espn-api';
import { rssService } from '../lib/rss-feed';
import { format } from 'date-fns';
import LiveGameWidget from '../components/LiveGameWidget';

export default async function HomePage() {
  let featuredNews: any[] = [];
  

  try {
    // Fetch real live data
    const [newsData] = await Promise.all([
      rssService.getFeaturedNews(),
    ]);

    featuredNews = newsData.slice(0, 3);
  } catch (error) {
    console.error('Failed to fetch homepage data:', error);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-16 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              NC State Sports Hub
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-red-100">
              Your ultimate destination for Wolfpack sports
            </p>
            
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Latest News */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Latest News</h2>
              {featuredNews.length > 0 ? (
                <div className="space-y-6">
                  {featuredNews.map((article, index) => (
                    <div key={article.id} className={`${index === 0 ? 'pb-6 border-b' : 'py-6 border-b'}`}>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 hover:text-red-600">
                          <a href={article.link} target="_blank" rel="noopener noreferrer">
                            {article.title}
                          </a>
                        </h3>
                        <span className="text-sm text-gray-500 ml-4">
                          {format(new Date(article.pubDate), 'MMM d')}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-3">{article.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          By {article.author || 'Staff'}
                        </span>
                        <a 
                          href={article.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-red-600 hover:text-red-700 font-medium"
                        >
                          Read More →
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">Loading latest news...</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <LiveGameWidget sport="basketball" />
            <LiveGameWidget sport="football" />
            <LiveGameWidget sport="baseball" />

            {/* Quick Links */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Links</h2>
              <div className="space-y-2">
                <a href="#" className="block text-red-600 hover:text-red-700 font-medium">
                  Basketball Schedule
                </a>
                <a href="#" className="block text-red-600 hover:text-red-700 font-medium">
                  Football Schedule
                </a>
                <a href="#" className="block text-red-600 hover:text-red-700 font-medium">
                  Team Roster
                </a>
                <a href="#" className="block text-red-600 hover:text-red-700 font-medium">
                  ACC Standings
                </a>
                <a href="https://www.backingthepack.com" target="_blank" rel="noopener noreferrer" className="block text-red-600 hover:text-red-700 font-medium">
                  Backing the Pack
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">NC State Sports Hub</h3>
            <p className="text-gray-400 mb-4">
              Powered by live ESPN data and real-time news feeds
            </p>
            <div className="flex justify-center space-x-6">
              <a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white">Contact Us</a>
            </div>
            <p className="text-gray-500 text-sm mt-4">
              © 2024 NC State Sports Hub. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}