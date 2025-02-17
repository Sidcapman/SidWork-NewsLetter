import React from 'react';
import { format } from 'date-fns';
import { Article } from '../types';
import { Clock, Calendar, ChevronDown, ChevronUp, Trash2, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Button from './Button';

interface ArticleCardProps {
  article: Article;
  onDelete?: () => void;
}

export default function ArticleCard({ article, onDelete }: ArticleCardProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [isCheckingAdmin, setIsCheckingAdmin] = React.useState(true);
  const [isExiting, setIsExiting] = React.useState(false);
  const articleRef = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    checkAdminStatus();
  }, []);

  async function checkAdminStatus() {
    try {
      setIsCheckingAdmin(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        setIsAdmin(false);
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsAdmin(false);
        return;
      }
      setIsAdmin(user.app_metadata?.role === 'admin');
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    } finally {
      setIsCheckingAdmin(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm('Are you sure you want to delete this article?')) {
      return;
    }

    setIsDeleting(true);
    try {
      // Start exit animation
      setIsExiting(true);
      
      // Wait for animation to complete
      if (articleRef.current) {
        articleRef.current.style.height = `${articleRef.current.offsetHeight}px`;
        // Force a reflow
        articleRef.current.offsetHeight;
        articleRef.current.style.height = '0';
        articleRef.current.style.margin = '0';
        articleRef.current.style.padding = '0';
        articleRef.current.style.opacity = '0';
      }

      // Wait for animation
      await new Promise(resolve => setTimeout(resolve, 500));

      const { error } = await supabase
        .from('articles')
        .delete()
        .eq('id', article.id);

      if (error) throw error;
      onDelete?.();
    } catch (err) {
      console.error('Error deleting article:', err);
      setIsExiting(false);
      alert('Failed to delete article. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <article 
      ref={articleRef}
      className={`
        border border-green-500 p-6 rounded-lg 
        transition-all duration-500 ease-in-out
        hover:border-green-300 bg-black/40 backdrop-blur
        ${isExiting ? 'overflow-hidden' : ''}
      `}
    >
      <div className="flex justify-between items-start">
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex-1 text-left flex justify-between items-start group"
        >
          <h2 className="text-2xl font-bold mb-3 text-green-400 group-hover:text-green-300 transition-colors">
            {article.title}
          </h2>
          <div className="transition-transform duration-300">
            {isExpanded ? (
              <ChevronUp className="w-6 h-6 text-green-500 mt-1 ml-4" />
            ) : (
              <ChevronDown className="w-6 h-6 text-green-500 mt-1 ml-4" />
            )}
          </div>
        </button>
        {isCheckingAdmin ? (
          <div className="ml-4 w-8 h-8 flex items-center justify-center">
            <Loader2 className="w-4 h-4 text-green-500 animate-spin" />
          </div>
        ) : isAdmin && (
          <Button
            onClick={handleDelete}
            isLoading={isDeleting}
            variant="outline"
            className={`
              ml-4 !p-2 transition-all duration-300
              ${isDeleting 
                ? 'border-red-500 text-red-400' 
                : 'hover:bg-red-500/20 hover:border-red-500 hover:text-red-400'
              }
            `}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>
      
      <div className="flex items-center space-x-4 text-green-300 text-sm mb-4">
        <div className="flex items-center">
          <Calendar className="w-4 h-4 mr-1" />
          <time>{format(new Date(article.created_at), 'MMMM d, yyyy')}</time>
        </div>
        <div className="flex items-center">
          <Clock className="w-4 h-4 mr-1" />
          <time>{format(new Date(article.created_at), 'HH:mm')}</time>
        </div>
      </div>
      
      <div 
        className={`
          mt-4 border-t border-green-500/30 overflow-hidden transition-all duration-300
          ${isExpanded ? 'pt-4 max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}
        `}
      >
        <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{article.content}</p>
      </div>
    </article>
  );
}