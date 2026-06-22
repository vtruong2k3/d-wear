import React from 'react';
import { Star } from 'lucide-react';
import type { IReview } from '../../../types/IReview';

interface Props {
    reviews: IReview[];
    averageRating: string;
    ratingCounts: { [key: number]: number };
}

const StarIcon = ({ filled }: { filled: boolean }) => (
    <Star className={`w-5 h-5 ${filled ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
);

const ReviewSummaryBar: React.FC<Props> = ({ reviews, averageRating, ratingCounts }) => {
    return (
        <div className="mb-10">
            <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="text-center md:w-1/3 flex flex-col items-center justify-center border-r border-gray-200">
                    <div className="text-6xl font-bold text-gray-900 mb-2">
                        {averageRating}
                    </div>
                    <div className="flex items-center justify-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                            <StarIcon key={i} filled={i < Math.floor(parseFloat(averageRating))} />
                        ))}
                    </div>
                    <div className="text-sm font-medium text-gray-500">{reviews.length} đánh giá</div>
                </div>

                <div className="flex-1 w-full md:w-2/3 pl-0 md:pl-8">
                    {Object.entries(ratingCounts).reverse().map(([rating, count]) => (
                        <div key={rating} className="flex items-center gap-3 mb-3">
                            <span className="flex items-center gap-1 text-sm font-medium w-12 text-gray-700">
                                {rating} <StarIcon filled={true} />
                            </span>
                            <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
                                <div
                                    className="bg-black h-3 rounded-full transition-all duration-700 ease-out"
                                    style={{
                                        width: reviews.length > 0 ? `${(count / reviews.length) * 100}%` : '0%'
                                    }}
                                ></div>
                            </div>
                            <span className="text-sm font-medium text-gray-600 w-10">{count}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ReviewSummaryBar;
