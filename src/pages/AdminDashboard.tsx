import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Mail, FileText, Loader2, AlertCircle } from 'lucide-react';
import { supabase, isAdmin } from '../lib/supabase';
import Button from '../components/Button';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [subscribers, setSubscribers] = React.useState<any[]>([]);
  const [users, setUsers] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [retryCount, setRetryCount] = React.useState(0);

  React.useEffect(() => {
    checkAdminAndLoadData();
  }, [retryCount]);

  async function checkAdminAndLoadData() {
    try {
      setIsLoading(true);
      setError(null);

      // Check admin status first
      const adminStatus = await isAdmin();
      if (!adminStatus) {
        navigate('/');
        return;
      }

      // Load data in parallel using Promise.all
      const [{ data: subscribersData, error: subscribersError }, { data: usersData, error: usersError }] = await Promise.all([
        supabase
          .from('subscribers')
          .select('*')
          .order('created_at', { ascending: false }),
        supabase
          .rpc('get_admin_users')
      ]);

      if (subscribersError) {
        console.error('Error loading subscribers:', subscribersError);
        throw new Error(subscribersError.message);
      }

      if (usersError) {
        console.error('Error loading users:', usersError);
        throw new Error(usersError.message);
      }

      setSubscribers(subscribersData || []);
      setUsers(usersData || []);
      setIsLoading(false);
    } catch (err) {
      console.error('Error loading admin data:', err);
      setError('Failed to load dashboard data. Please try again.');
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-3 text-green-500">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="text-lg">Loading dashboard data...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center text-red-400 mb-2">
            <AlertCircle className="w-8 h-8" />
          </div>
          <p className="text-red-400 mb-4">{error}</p>
          <Button 
            onClick={() => setRetryCount(count => count + 1)} 
            variant="outline"
            className="border-green-500 text-green-400 hover:bg-green-500 hover:text-black"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-green-400">Admin Dashboard_</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Subscribers Section */}
        <div className="border border-green-500 rounded-lg p-6 bg-black/50">
          <div className="flex items-center mb-4">
            <Mail className="w-6 h-6 text-green-500 mr-2" />
            <h2 className="text-xl font-bold text-green-400">Subscribers</h2>
          </div>
          <div className="space-y-4">
            {subscribers.length > 0 ? (
              subscribers.map((subscriber) => (
                <div
                  key={subscriber.id}
                  className="flex items-center justify-between p-3 border border-green-500/30 rounded-lg hover:border-green-500/50 transition-colors"
                >
                  <span className="text-green-300">{subscriber.email}</span>
                  <span className="text-green-500/60 text-sm">
                    {new Date(subscriber.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-center text-green-300/60 py-8">
                No subscribers yet
              </p>
            )}
          </div>
        </div>

        {/* Users Section */}
        <div className="border border-green-500 rounded-lg p-6 bg-black/50">
          <div className="flex items-center mb-4">
            <Users className="w-6 h-6 text-green-500 mr-2" />
            <h2 className="text-xl font-bold text-green-400">Registered Users</h2>
          </div>
          <div className="space-y-4">
            {users.length > 0 ? (
              users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 border border-green-500/30 rounded-lg hover:border-green-500/50 transition-colors"
                >
                  <div className="flex flex-col">
                    <span className="text-green-300">{user.email}</span>
                    <span className="text-green-500/60 text-sm">
                      Role: {user.role || 'user'}
                    </span>
                  </div>
                  <span className="text-green-500/60 text-sm">
                    {new Date(user.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-center text-green-300/60 py-8">
                No registered users yet
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-12 p-6 border border-green-500 rounded-lg bg-black/50">
        <div className="flex items-center mb-4">
          <FileText className="w-6 h-6 text-green-500 mr-2" />
          <h2 className="text-xl font-bold text-green-400">Admin Guide</h2>
        </div>
        <div className="prose prose-invert prose-green max-w-none">
          <h3 className="text-green-400">Creating an Admin Account</h3>
          <ol className="list-decimal pl-5 space-y-2 text-green-300">
            <li>Sign up for a new account through the regular login page</li>
            <li>Access your Supabase project dashboard</li>
            <li>Go to SQL Editor</li>
            <li>Run the following SQL to set the admin role:
              <pre className="bg-black/50 p-3 rounded-lg text-sm">
                {`-- Replace 'admin@example.com' with the email of the user you want to make admin
UPDATE auth.users
SET raw_app_meta_data = jsonb_set(
  raw_app_meta_data,
  '{role}',
  '"admin"'
)
WHERE email = 'admin@example.com';`}
              </pre>
            </li>
            <li>The user will now have admin privileges and access to the admin dashboard</li>
          </ol>

          <h3 className="text-green-400 mt-6">Admin Capabilities</h3>
          <ul className="list-disc pl-5 space-y-2 text-green-300">
            <li>View all registered users</li>
            <li>View all newsletter subscribers</li>
            <li>Create and publish articles</li>
            <li>Monitor user engagement</li>
          </ul>

          <div className="mt-6 p-4 bg-yellow-500/20 rounded-lg">
            <p className="text-yellow-300">
              <strong>Note:</strong> Always follow security best practices and be cautious when granting admin privileges.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}