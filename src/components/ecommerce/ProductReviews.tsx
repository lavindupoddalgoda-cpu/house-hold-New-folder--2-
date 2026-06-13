'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MessageSquarePlus, Send, User } from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { SEED_REVIEWS } from '@/types';
import type { Review } from '@/types';

interface ProductReviewsProps {
  productId: string;
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const { user } = useAuth();
  const { addToast } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [newRating, setNewRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [newText, setNewText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [localReviews, setLocalReviews] = useState<Review[]>([]);

  const reviews = useMemo(() => {
    const seed = SEED_REVIEWS.filter((r) => r.productId === productId && r.isApproved);
    return [...localReviews, ...seed];
  }, [productId, localReviews]);

  const ratingDistribution = useMemo(() => {
    const dist = [0, 0, 0, 0, 0]; // 1★ to 5★
    reviews.forEach((r) => {
      if (r.rating >= 1 && r.rating <= 5) dist[r.rating - 1]++;
    });
    return dist.reverse(); // 5★ first
  }, [reviews]);

  const averageRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  }, [reviews]);

  const handleSubmit = async () => {
    if (newRating === 0 || newText.trim().length < 10) {
      addToast({ message: 'Please provide a rating and review (min 10 chars)', type: 'warning' });
      return;
    }
    setSubmitting(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 800));
    const review: Review = {
      id: `r-local-${Date.now()}`,
      productId,
      userId: user?.uid || 'anonymous',
      displayName: user?.displayName || 'Anonymous',
      rating: newRating,
      text: newText.trim(),
      isApproved: true,
      createdAt: { seconds: Date.now() / 1000, nanoseconds: 0 },
    };
    setLocalReviews((prev) => [review, ...prev]);
    setNewRating(0);
    setNewText('');
    setShowForm(false);
    setSubmitting(false);
    addToast({ message: 'Review submitted successfully!', type: 'success' });
  };

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
        {/* Average */}
        <div className="flex flex-col items-center gap-1 sm:min-w-[120px]">
          <span className="font-sans text-4xl font-bold text-navy">{averageRating.toFixed(1)}</span>
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  'h-4 w-4',
                  i < Math.round(averageRating) ? 'fill-gold text-gold' : 'fill-navy/10 text-navy/10'
                )}
              />
            ))}
          </div>
          <span className="font-sans text-xs text-navy/40">
            {reviews.length} review{reviews.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Distribution bars */}
        <div className="flex flex-1 flex-col gap-1.5">
          {[5, 4, 3, 2, 1].map((star, idx) => {
            const count = ratingDistribution[idx];
            const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
            return (
              <div key={star} className="flex items-center gap-2">
                <span className="w-3 font-sans text-xs text-navy/50">{star}</span>
                <Star className="h-3 w-3 fill-gold text-gold" />
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-cream">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.5, delay: idx * 0.05 }}
                    className="h-full rounded-full bg-gold"
                  />
                </div>
                <span className="w-6 text-right font-sans text-[11px] text-navy/40">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      <Separator />

      {/* Write a Review button */}
      <div className="flex items-center justify-between">
        <h3 className="font-sans text-sm font-semibold text-navy">Customer Reviews</h3>
        {user ? (
          <Button
            onClick={() => setShowForm(!showForm)}
            variant="outline"
            size="sm"
            className="gap-1.5 rounded-xl border-emerald-200 font-sans text-emerald-600 hover:bg-emerald-50"
          >
            <MessageSquarePlus className="h-3.5 w-3.5" />
            Write a Review
          </Button>
        ) : (
          <p className="font-sans text-xs text-navy/40">Log in to write a review</p>
        )}
      </div>

      {/* Review Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="space-y-4 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4">
              {/* Star selector */}
              <div className="space-y-2">
                <label className="font-sans text-xs font-semibold text-navy/60">Your Rating</label>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <button
                      key={i}
                      onMouseEnter={() => setHoverRating(i + 1)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setNewRating(i + 1)}
                      className="transition-transform hover:scale-110"
                      aria-label={`Rate ${i + 1} star${i > 0 ? 's' : ''}`}
                    >
                      <Star
                        className={cn(
                          'h-6 w-6 transition-colors',
                          (hoverRating || newRating) > i
                            ? 'fill-gold text-gold'
                            : 'fill-navy/10 text-navy/10'
                        )}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Textarea */}
              <div className="space-y-2">
                <label className="font-sans text-xs font-semibold text-navy/60">Your Review</label>
                <Textarea
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  placeholder="Share your experience with this product..."
                  className="min-h-[80px] resize-none rounded-xl border-emerald-200 font-sans text-sm focus-visible:ring-emerald-500"
                />
                <p className="font-sans text-[11px] text-navy/30">
                  {newText.length < 10 ? `${10 - newText.length} more characters needed` : 'Looks good!'}
                </p>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowForm(false)}
                  className="font-sans text-navy/50"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={submitting || newRating === 0 || newText.trim().length < 10}
                  size="sm"
                  className="gap-1.5 rounded-xl bg-emerald-500 font-sans hover:bg-emerald-600"
                >
                  <Send className="h-3.5 w-3.5" />
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Review Cards */}
      <div className="space-y-4">
        <AnimatePresence>
          {reviews.map((review, idx) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ delay: idx * 0.05 }}
              className="rounded-2xl border border-navy/5 bg-white p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50">
                    <User className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-sans text-sm font-semibold text-navy">{review.displayName}</p>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              'h-3 w-3',
                              i < review.rating
                                ? 'fill-gold text-gold'
                                : 'fill-navy/10 text-navy/10'
                            )}
                          />
                        ))}
                      </div>
                      <span className="font-sans text-[11px] text-navy/30">
                        {formatDate(review.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <p className="mt-3 font-sans text-sm leading-relaxed text-navy/70">{review.text}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {reviews.length === 0 && (
        <div className="py-8 text-center">
          <p className="font-sans text-sm text-navy/30">No reviews yet. Be the first to share your thoughts!</p>
        </div>
      )}
    </div>
  );
}
