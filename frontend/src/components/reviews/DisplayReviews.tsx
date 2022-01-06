import React, { useState } from 'react';

import PropTypes from 'prop-types';
import ReviewCard from './ReviewCard';
import UiSectionSeparator from '../ui/UiSectionSeperator';

interface Review {
    id: string;
    author: { name: string; id: string; photo_main: { src: string } | null };
    comment: string;
    image: File | null;
    stars: string;
    recipe: string;
    created_at: string;
}

const DisplayReviews = ({ reviewsToDisplay }) => {
    const getReviews = () => {
        if (reviewsToDisplay) {
            const reviewsOnPage = [];
            const result = [];

            reviewsToDisplay.map((review: Review) => {
                reviewsOnPage.push(
                    <ReviewCard
                        author={review.author}
                        recipe={review.recipe}
                        id={review.id}
                        stars={review.stars}
                        comment={review.comment}
                        image={review.image}
                        created_at={review.created_at}
                    />
                );
            });
            for (let i = 0; i < reviewsToDisplay.length; i += 1) {
                result.push(
                    <div key={i}>
                        <div>{reviewsOnPage[i] ? reviewsOnPage[i] : null}</div>
                    </div>
                );
            }

            return result;
        } else {
            return null;
        }
    };
    return (
        <div>
            {getReviews()}
            <UiSectionSeparator />
        </div>
    );
};

DisplayReviews.propTypes = {
    reviewsToDisplay: PropTypes.array.isRequired,
};

export default DisplayReviews;
