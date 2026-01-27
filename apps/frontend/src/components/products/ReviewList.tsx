'use client';

import { Star, User, Calendar } from 'lucide-react';

interface Review {
    id: string;
    rating: number;
    comment: string;
    createdAt: string;
    user: {
        name: string;
        picture?: string;
    };
}

interface ReviewListProps {
    reviews: Review[];
}

export default function ReviewList({ reviews }: ReviewListProps) {
    if (reviews.length === 0) {
        return (
            <div className="bg-white p-12 text-center rounded-[2.5rem] border border-gray-100 shadow-sm">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                    <Star size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No reviews yet</h3>
                <p className="text-gray-500 font-medium">Be the first to share your experience with this product!</p>
            </div>
        );
    }

    const averageRating = reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length;

    return (
        <div className="space-y-8">
            {/* Review Stats Header */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-50 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 opacity-60"></div>
                <div className="text-center md:text-left">
                    <p className="text-sm font-black text-gray-400 uppercase tracking-widest mb-1">Average Rating</p>
                    <div className="flex items-end gap-2">
                        <h2 className="text-6xl font-black text-gray-900 tracking-tight">{averageRating.toFixed(1)}</h2>
                        <div className="mb-2">
                            <div className="flex gap-0.5 text-yellow-400 mb-1">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <Star key={i} size={16} className={i <= Math.round(averageRating) ? 'fill-yellow-400' : 'text-gray-200'} />
                                ))}
                            </div>
                            <p className="text-xs font-bold text-gray-500">{reviews.length} total reviews</p>
                        </div>
                    </div>
                </div>

                <div className="flex-1 w-full max-w-xs space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => {
                        const count = reviews.filter(r => r.rating === rating).length;
                        const percentage = (count / reviews.length) * 100;
                        return (
                            <div key={rating} className="flex items-center gap-3">
                                <span className="text-xs font-bold text-gray-500 w-3">{rating}</span>
                                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${percentage}%` }}></div>
                                </div>
                                <span className="text-[10px] font-bold text-gray-400 w-6 text-right">{count}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Individual Reviews */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reviews.map((review) => (
                    <div key={review.id} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-lg transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm overflow-hidden border border-blue-100">
                                    {review.user.picture ? (
                                        <img src={review.user.picture} alt={review.user.name} className="w-full h-full object-cover" />
                                    ) : (
                                        review.user.name.charAt(0).toUpperCase()
                                    )}
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 text-sm">{review.user.name}</h4>
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                        <Calendar size={10} />
                                        {new Date(review.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-0.5 text-yellow-400">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <Star key={i} size={12} className={i <= review.rating ? 'fill-yellow-400' : 'text-gray-200'} />
                                ))}
                            </div>
                        </div>
                        <p className="text-gray-700 text-sm font-medium leading-relaxed">
                            {review.comment}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
