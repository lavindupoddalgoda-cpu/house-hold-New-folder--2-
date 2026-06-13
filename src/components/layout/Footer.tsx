'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Home, Instagram, Facebook, Twitter, Youtube, Send, ArrowRight } from 'lucide-react';
import { STORE } from '@/types';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const quickLinks = [
    { label: 'Home', href: '/' },
    { label: 'Catalog', href: '/catalog' },
    { label: 'About Us', href: '/#about' },
    { label: 'Contact', href: '/#contact' },
  ];

  const customerServiceLinks = [
    { label: 'Shipping Policy', href: '/#shipping' },
    { label: 'Returns & Exchange', href: '/#returns' },
    { label: 'FAQ', href: '/#faq' },
    { label: 'Privacy Policy', href: '/#privacy' },
  ];

  const socialLinks = [
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Youtube, href: '#', label: 'YouTube' },
  ];

  return (
    <footer className="bg-[#0F172A] text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand Info */}
          <div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500">
                <Home className="h-4.5 w-4.5 text-white" />
              </div>
              <span className="font-display text-xl font-bold">{STORE.name}</span>
            </div>
            <p className="mt-4 font-sans text-sm leading-relaxed text-white/60">
              {STORE.tagline}. Discover premium home essentials crafted for Sri Lankan homes, from kitchen to bedroom and beyond.
            </p>
            <div className="mt-6 flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-emerald-500"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-white/80">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="font-sans text-sm text-white/50 transition-colors hover:text-emerald-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-white/80">
              Customer Service
            </h3>
            <ul className="mt-4 space-y-3">
              {customerServiceLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="font-sans text-sm text-white/50 transition-colors hover:text-emerald-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-5 space-y-1.5">
              <p className="font-sans text-xs text-white/40">{STORE.email}</p>
              <p className="font-sans text-xs text-white/40">{STORE.phone}</p>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-white/80">
              Newsletter
            </h3>
            <p className="mt-4 font-sans text-sm text-white/50">
              Get the latest deals and new arrivals delivered to your inbox.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="mt-4">
              <div className="flex overflow-hidden rounded-lg border border-white/10">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Your email"
                  className="h-10 flex-1 bg-transparent px-3 font-sans text-sm text-white outline-none placeholder:text-white/30"
                />
                <button
                  type="submit"
                  className="flex h-10 w-10 shrink-0 items-center justify-center bg-emerald-500 transition-colors hover:bg-emerald-600"
                  aria-label="Subscribe"
                >
                  {subscribed ? (
                    <ArrowRight className="h-4 w-4 text-white" />
                  ) : (
                    <Send className="h-4 w-4 text-white" />
                  )}
                </button>
              </div>
              {subscribed && (
                <p className="mt-2 font-sans text-xs text-emerald-400">
                  Subscribed successfully!
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-white/10 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="font-sans text-xs text-white/40">
              &copy; {new Date().getFullYear()} {STORE.name}. All rights reserved.
            </p>
            <p className="font-sans text-xs text-white/30">
              Crafted with care in {STORE.address}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
