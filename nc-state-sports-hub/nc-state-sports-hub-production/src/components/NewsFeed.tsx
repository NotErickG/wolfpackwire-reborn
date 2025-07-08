'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import NewsCard from './NewsCard';
import { rssService, RSSArticle } from '../lib/rss-feed';
import LoadingSpinner from './LoadingSpinner'; // Assuming this component exists

const ARTICLES_PER_PAGE = 9; // Number of articles to load per page

/**
 * NewsFeed Component for NC State Sports Hub
 * Displays a comprehensive news feed with infinite scroll, search, and category filtering.
 */
export default function NewsFeed() {
  const [articles, setArticles] = useState<RSSArticle[]>([]);
  const [displayedArticles, setDisplayedArticles] = useState<RSSArticle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const observerRef = useRef<HTMLDivElement>(null);
  const allArticlesRef = useRef<RSSArticle[]>([]); // To store all fetched articles for filtering/searching

  // Fetch articles on component mount
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedArticles = await rssService.getBackingThePackNews();
        allArticlesRef.current = fetchedArticles; // Store all articles
        setArticles(fetchedArticles);
        setDisplayedArticles(fetchedArticles.slice(0, ARTICLES_PER_PAGE));
        setHasMore(fetchedArticles.length > ARTICLES_PER_PAGE);
      } catch (err) {
        console.error('Failed to fetch news articles:', err);
        setError('Failed to load news. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  // Effect for infinite scrolling
  useEffect(() => {
    if (loading || error || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((prevPage) => prevPage + 1);
        }
      },
      { threshold: 0.1 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [loading, error, hasMore]);

  // Effect to load more articles when page changes
  useEffect(() => {
    if (page === 1) return; // Already loaded initial articles

    const startIndex = (page - 1) * ARTICLES_PER_PAGE;
    const endIndex = startIndex + ARTICLES_PER_PAGE;
    const newArticles = articles.slice(startIndex, endIndex);

    setDisplayedArticles((prevArticles) => [...prevArticles, ...newArticles]);
    setHasMore(endIndex < articles.length);
  }, [page, articles]);

  // Filter and search logic
  const applyFiltersAndSearch = useCallback(() => {
    let filtered = allArticlesRef.current;

    // Category filtering
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(article =>
        article.category?.some(cat => cat.toLowerCase() === selectedCategory.toLowerCase())
      );
    }

    // Search term filtering
    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(lowerCaseSearchTerm) ||
        article.description.toLowerCase().includes(lowerCaseSearchTerm) ||
        article.author?.toLowerCase().includes(lowerCaseSearchTerm) ||
        article.category?.some(cat => cat.toLowerCase().includes(lowerCaseSearchTerm))
      );
    }

    setArticles(filtered); // Update the articles array that pagination uses
    setDisplayedArticles(filtered.slice(0, ARTICLES_PER_PAGE)); // Reset displayed articles
    setPage(1); // Reset page to 1
    setHasMore(filtered.length > ARTICLES_PER_PAGE);
  }, [searchTerm, selectedCategory]);

  // Apply filters and search when dependencies change
  useEffect(() => {
    applyFiltersAndSearch();
  }, [searchTerm, selectedCategory, applyFiltersAndSearch]);

  // Extract unique categories from all articles
  const categories = Array.from(
    new Set(allArticlesRef.current.flatMap(article => article.category || []))
  ).sort();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-red-700 mb-6 text-center">Latest Wolfpack News</h1>

      {/* Search and Filter */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Search news..."
          className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 bg-white"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="All">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedArticles.map((article) => (
          <NewsCard key={article.id} article={article} />
        ))}
      </div>

      {loading && (
        <div className="flex justify-center items-center py-8">
          <LoadingSpinner />
        </div>
      )}

      {!loading && hasMore && (
        <div ref={observerRef} className="text-center py-8">
          <p className="text-gray-500">Loading more news...</p>
        </div>
      )}

      {!loading && !hasMore && displayedArticles.length > 0 && (
        <div className="text-center py-8 text-gray-500">
          You've reached the end of the news feed.
        </div>
      )}

      {!loading && displayedArticles.length === 0 && !error && (
        <div className="text-center py-8 text-gray-500">
          No news articles found matching your criteria.
        </div>
      )}
    </div>
  );
}
