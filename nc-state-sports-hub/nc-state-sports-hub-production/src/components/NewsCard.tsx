import React from 'react';
import { RSSArticle } from '../lib/rss-feed';

interface NewsCardProps {
  article: RSSArticle;
}

/**
 * NewsCard Component for NC State Sports Hub
 * Displays a single news article in a card format.
 */
export default function NewsCard({ article }: NewsCardProps) {
  const formattedDate = new Date(article.pubDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <a href={article.link} target="_blank" rel="noopener noreferrer" className="block">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
        {article.imageUrl && (
          <div className="relative w-full h-48 overflow-hidden">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        )}
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="text-xl font-bold text-red-700 mb-2 leading-tight">
            {article.title}
          </h3>
          <p className="text-gray-600 text-sm mb-3 flex-grow">
            {article.description.length > 150
              ? `${article.description.substring(0, 150)}...`
              : article.description}
          </p>
          <div className="flex items-center justify-between text-xs text-gray-500 mt-auto">
            <span>{formattedDate}</span>
            {article.author && <span>By {article.author}</span>}
          </div>
        </div>
      </div>
    </a>
  );
}