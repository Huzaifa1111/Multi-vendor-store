'use client';

import { useState } from 'react';
import { Star, Loader2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import api from '@/lib/api';

interface ReviewFormProps {
    productId: number;
    onSuccess: () => void;
}

export default function ReviewForm({ productId, onSuccess }: ReviewFormProps) {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) {
            setError('Please select a rating');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            await api.post('/reviews', {
                productId,
                rating,
                comment,
            });
            setRating(0);
            setComment('');
            onSuccess();
        } catch (err: any) {
            console.error('Failed to submit review:', err);
            setError(err.message || 'Failed to submit review. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900">Write a Review</h3>

            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Rating</label>
                <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHover(star)}
                            onMouseLeave={() => setHover(0)}
                            className="focus:outline-none transition-transform hover:scale-110"
                        >
                            <Star
                                size={32}
                                className={`${star <= (hover || rating)
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'text-gray-200'
                                    } transition-colors`}
                            />
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <label htmlFor="comment" className="block text-sm font-bold text-gray-700 mb-2">
                    Your Comment
                </label>
                <textarea
                    id="comment"
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                    placeholder="Share your experience with this product..."
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all font-medium text-gray-900"
                />
            </div>

            {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

            <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl font-black shadow-lg shadow-blue-100"
            >
                {isSubmitting ? (
                    <span className="flex items-center gap-2">
                        <Loader2 className="animate-spin" size={20} />
                        Submitting...
                    </span>
                ) : (
                    'Submit Review'
                )}
            </Button>
        </form>
    );
}
