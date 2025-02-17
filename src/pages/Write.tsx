import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PenTool, Save } from 'lucide-react';
import { supabase, isAdmin } from '../lib/supabase';
import Button from '../components/Button';

export default function Write() {
  const navigate = useNavigate();
  const [title, setTitle] = React.useState('');
  const [content, setContent] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/login');
      return;
    }

    const adminStatus = await isAdmin();
    if (!adminStatus) {
      navigate('/');
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('articles')
        .insert([{
          title,
          content,
          user_id: session.user.id
        }]);

      if (error) throw error;
      navigate('/');
    } catch (err) {
      console.error('Error saving article:', err);
      setError('Failed to save article. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8 flex items-center space-x-3">
        <PenTool className="w-8 h-8 text-green-500" />
        <h1 className="text-3xl font-bold text-green-400">Write New Entry_</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-green-300 mb-2">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What did you learn today?"
            className="w-full px-4 py-2 bg-black border border-green-500 rounded-lg focus:outline-none focus:border-green-300 text-green-400 placeholder-green-700"
            required
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-green-300 mb-2">
            Content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your insights and learnings..."
            className="w-full h-64 px-4 py-2 bg-black border border-green-500 rounded-lg focus:outline-none focus:border-green-300 text-green-400 placeholder-green-700 resize-none"
            required
          />
        </div>

        {error && (
          <p className="text-red-400 text-sm">{error}</p>
        )}

        <div className="flex justify-end">
          <Button
            type="submit"
            isLoading={isSubmitting}
            className="w-full sm:w-auto"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Entry_
          </Button>
        </div>
      </form>
    </div>
  );
}