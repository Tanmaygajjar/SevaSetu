'use client';

import React from 'react';
import Link from 'next/link';
import { Calendar, User, Clock, ArrowRight } from 'lucide-react';

const POSTS = [
  {
    title: 'How Sahaayak is Scaling Disaster Relief in Gujarat',
    excerpt: 'A deep dive into our AI orchestration during the recent monsoon season.',
    author: 'Sahaayak Team',
    date: 'Apr 15, 2026',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=800'
  },
  {
    title: '5 Ways to Maximize Your Impact as a Weekend Volunteer',
    excerpt: 'Small efforts lead to big changes. Here is how you can help even with a busy schedule.',
    author: 'Community Lead',
    date: 'Apr 10, 2026',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1559027615-cd26714e93af?auto=format&fit=crop&q=80&w=800'
  },
  {
    title: 'Transparency in Philanthropy: The Blockchain Ledger',
    excerpt: 'Understanding how Sahaayak ensures every rupee reaches the intended cause.',
    author: 'Tech Architect',
    date: 'Mar 28, 2026',
    readTime: '8 min read',
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=800'
  }
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[var(--surface)] pt-24 pb-20 font-dm-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="max-w-3xl mb-16">
          <h1 className="text-4xl md:text-5xl font-bold font-mukta text-[var(--ink)] mb-4">
            Blog & Stories
          </h1>
          <p className="text-lg text-[var(--ink-muted)]">
            Insights from the field, technical deep-dives, and heart-warming impact stories from our community.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {POSTS.map((post, i) => (
            <article key={i} className="bg-white rounded-3xl overflow-hidden border border-[var(--border)] shadow-sm hover:shadow-xl transition-all group flex flex-col h-full">
              <div className="h-48 overflow-hidden relative">
                <img src={post.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={post.title} />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-bold text-[var(--saffron)]">Insight</span>
                </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-4 text-xs text-gray-600 mb-4 font-bold uppercase tracking-widest">
                  <span className="flex items-center gap-1"><Calendar size={12} /> {post.date}</span>
                  <span className="flex items-center gap-1"><Clock size={12} /> {post.readTime}</span>
                </div>
                
                <h2 className="text-xl font-bold font-mukta text-[var(--ink)] mb-3 group-hover:text-[var(--saffron)] transition-colors leading-snug">
                  {post.title}
                </h2>
                
                <p className="text-sm text-[var(--ink-muted)] mb-6 flex-1 line-clamp-3">
                  {post.excerpt}
                </p>
                
                <div className="pt-6 border-t border-[var(--border)] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[var(--surface-2)] flex items-center justify-center font-bold text-[10px]">{post.author.charAt(0)}</div>
                    <span className="text-xs font-bold text-[var(--ink)]">{post.author}</span>
                  </div>
                  <button className="text-[var(--saffron)] hover:translate-x-1 transition-transform">
                    <ArrowRight size={20} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

      </div>
    </div>
  );
}
