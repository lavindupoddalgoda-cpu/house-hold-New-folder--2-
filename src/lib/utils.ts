import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return `Rs. ${amount.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatCurrencyShort(amount: number): string {
  return `Rs. ${amount.toLocaleString('en-LK')}`;
}

export function generateOrderId(): string {
  return 'HN' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 5).toUpperCase();
}

export function debounce<T extends (...args: unknown[]) => void>(fn: T, ms: number) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let t: any;
  return (...args: Parameters<T>) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}

export function formatDate(timestamp: { seconds: number }): string {
  return new Date(timestamp.seconds * 1000).toLocaleDateString('en-LK', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

export function isValidSLPhone(phone: string): boolean {
  return /^(?:\+94|0)(?:7[01245678])\d{7}$/.test(phone.replace(/[\s-]/g, ''));
}

export async function safeFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`[${res.status}] ${res.statusText}: ${text.substring(0, 200)}`);
  }
  return res.json() as Promise<T>;
}
