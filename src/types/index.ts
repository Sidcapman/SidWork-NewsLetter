export interface Article {
  id: string;
  title: string;
  content: string;
  created_at: string;
  user_id: string;
}

export interface User {
  id: string;
  email: string;
}

export interface Subscriber {
  id: string;
  email: string;
  created_at: string;
}

export interface SentNewsletter {
  id: string;
  content: string;
  sent_at: string;
}