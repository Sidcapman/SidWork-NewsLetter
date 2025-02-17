# Tech Blog Platform

A modern, minimalist tech blog platform built with React, TypeScript, and Supabase. Features a sleek terminal-inspired design with admin capabilities for content management.

![Tech Blog Screenshot](https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=3270&ixlib=rb-4.0.3)

## Features

- 🚀 Modern React with TypeScript
- 🎨 Sleek terminal-inspired design
- 🔐 Secure authentication system
- 👤 Admin dashboard
- 📝 Rich text article editor
- 📨 Newsletter subscription system
- 🎯 Role-based access control
- ⚡ Real-time updates

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- npm (v9 or higher)

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd tech-blog-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new project at [Supabase](https://supabase.com)
   - Copy your project's URL and anon key
   - Create a `.env` file in the root directory:
     ```env
     VITE_SUPABASE_URL=your_supabase_project_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Open your browser and navigate to `http://localhost:5173`
   <!-- - Default admin credentials:
     - Email: anugamsiddy@gmail.com
     - Password: anugam@2001 -->

## Project Structure

```
tech-blog-platform/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/         # Page components
│   ├── lib/           # Utilities and configurations
│   └── types/         # TypeScript type definitions
├── public/            # Static assets
└── supabase/         # Database migrations
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Database Schema

The application uses the following main tables:
- `articles` - Blog posts
- `subscribers` - Newsletter subscribers
- `auth.users` - User authentication and roles

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Supabase](https://supabase.com) for the backend infrastructure
- [Lucide Icons](https://lucide.dev) for the beautiful icons
- [Tailwind CSS](https://tailwindcss.com) for the styling system