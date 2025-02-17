import React from 'react';
import { Link } from 'react-router-dom';
import { Terminal, Loader2, LayoutDashboard, PenTool } from 'lucide-react';
import { supabase, seedArticles, isAdmin } from '../lib/supabase';
import { Article } from '../types';
import ArticleCard from '../components/ArticleCard';
import Button from '../components/Button';

export default function Home() {
  const [articles, setArticles] = React.useState<Article[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [isAdminUser, setIsAdminUser] = React.useState(false);
  const [isCheckingAdmin, setIsCheckingAdmin] = React.useState(true);

  React.useEffect(() => {
    loadArticles();
    checkAdminStatus();
  }, []);

  async function checkAdminStatus() {
    try {
      setIsCheckingAdmin(true);
      const adminStatus = await isAdmin();
      setIsAdminUser(adminStatus);
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdminUser(false);
    } finally {
      setIsCheckingAdmin(false);
    }
  }

  async function loadArticles() {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data: articlesData, error: articlesError } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false });

      if (articlesError) throw articlesError;
      
      if (!articlesData || articlesData.length === 0) {
        await seedArticles();
        
        const { data: seededArticles, error: seededError } = await supabase
          .from('articles')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (seededError) throw seededError;
        if (seededArticles) {
          setArticles(seededArticles);
        }
      } else {
        setArticles(articlesData);
      }
    } catch (err) {
      console.error('Error loading articles:', err);
      setError('Failed to load articles. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }

  const handleArticleDelete = () => {
    loadArticles();
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-16">
        <div className="flex items-center justify-center mb-4">
          <Terminal className="w-12 h-12 text-green-500" />
        </div>
        <h1 className="text-5xl font-bold mb-4 text-green-400 animate-pulse">
          Daily Tech Insights_
        </h1>
        <p className="text-green-300 text-lg mb-8">
          Weekly dispatches from the digital frontier
        </p>
        {isCheckingAdmin ? (
          <div className="inline-flex items-center justify-center px-6 py-3 bg-green-500/20 text-green-400 rounded-lg">
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            Checking permissions...
          </div>
        ) : isAdminUser && (
          <div className="flex items-center justify-center space-x-4">
            <Link
              to="/write"
              className="inline-flex items-center px-6 py-3 bg-green-500 text-black rounded-lg hover:bg-green-400 transition-colors"
            >
              <PenTool className="w-5 h-5 mr-2" />
              Write New Article_
            </Link>
            <Link
              to="/admin"
              className="inline-flex items-center px-6 py-3 border-2 border-green-500 text-green-400 rounded-lg hover:bg-green-500 hover:text-black transition-colors"
            >
              <LayoutDashboard className="w-5 h-5 mr-2" />
              Dashboard_
            </Link>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center">
          <div className="animate-pulse space-y-8 w-full">
            {[1, 2, 3].map((n) => (
              <div key={n} className="border border-green-500/20 p-6 rounded-lg">
                <div className="h-6 bg-green-500/20 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-green-500/20 rounded w-1/4 mb-6"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-green-500/20 rounded w-full"></div>
                  <div className="h-4 bg-green-500/20 rounded w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : error ? (
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <Button onClick={() => loadArticles()} variant="outline">
            Try Again
          </Button>
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center">
          <p className="text-green-300 mb-8">No articles yet. Be the first to contribute!</p>
        </div>
      ) : (
        <div className="space-y-12">
          {articles.map((article) => (
            <ArticleCard 
              key={article.id} 
              article={article} 
              onDelete={handleArticleDelete}
            />
          ))}
        </div>
      )}

      <div className="mt-16 text-center space-y-4">
        <Link
          to="/subscribe"
          className="inline-block px-8 py-3 border-2 border-green-500 rounded-lg text-green-400 hover:bg-green-500 hover:text-black transition-all duration-300 transform hover:-translate-y-1"
        >
          Subscribe to Weekly Updates_
        </Link>
        <p className="text-green-300/60 text-sm">
          Join our community of tech enthusiasts
        </p>
      </div>
    </div>
  );
}