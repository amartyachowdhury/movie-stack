import React, { useState, useEffect } from 'react';
import { Movie } from '../../../shared/types';
import './MovieReviews.css';

interface Review {
  id: number;
  userId: number;
  username: string;
  userAvatar?: string;
  movieId: number;
  rating: number;
  title: string;
  content: string;
  helpfulVotes: number;
  totalVotes: number;
  createdAt: string;
  updatedAt?: string;
  isEdited: boolean;
  userRating?: number; // Current user's rating of this review
}

interface Comment {
  id: number;
  userId: number;
  username: string;
  userAvatar?: string;
  reviewId: number;
  content: string;
  helpfulVotes: number;
  totalVotes: number;
  createdAt: string;
  updatedAt?: string;
  isEdited: boolean;
  parentId?: number; // For nested comments
  replies?: Comment[];
  userRating?: number;
}

interface MovieReviewsProps {
  movie: Movie;
  userId?: number;
  onClose?: () => void;
}

const MovieReviews: React.FC<MovieReviewsProps> = ({ movie, userId, onClose }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'reviews' | 'write-review'>('reviews');
  const [sortBy, setSortBy] = useState<'recent' | 'helpful' | 'rating'>('recent');
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [commentContent, setCommentContent] = useState('');
  const [replyTo, setReplyTo] = useState<Comment | null>(null);

  // Review form state
  const [reviewForm, setReviewForm] = useState({
    rating: 0,
    title: '',
    content: ''
  });

  useEffect(() => {
    fetchReviews();
  }, [movie.id, sortBy, filterRating]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      const mockReviews: Review[] = [
        {
          id: 1,
          userId: 1,
          username: 'MovieBuff2024',
          userAvatar: '/avatars/user1.jpg',
          movieId: movie.id || 0,
          rating: 5,
          title: 'A Masterpiece of Storytelling',
          content: 'This film completely exceeded my expectations. The cinematography is breathtaking, the acting is phenomenal, and the story is both engaging and thought-provoking. The director has created something truly special here that will be remembered for years to come.',
          helpfulVotes: 127,
          totalVotes: 145,
          createdAt: '2024-01-15T10:30:00Z',
          isEdited: false,
          userRating: 1
        },
        {
          id: 2,
          userId: 2,
          username: 'CinemaLover',
          movieId: movie.id || 0,
          rating: 4,
          title: 'Solid Entertainment with Great Performances',
          content: 'While not perfect, this movie delivers solid entertainment with standout performances from the lead actors. The pacing is good and it keeps you engaged throughout. Some plot points could have been developed better, but overall it\'s worth watching.',
          helpfulVotes: 89,
          totalVotes: 112,
          createdAt: '2024-01-14T15:45:00Z',
          isEdited: false,
          userRating: 1
        },
        {
          id: 3,
          userId: 3,
          username: 'FilmCritic',
          userAvatar: '/avatars/user3.jpg',
          movieId: movie.id || 0,
          rating: 3,
          title: 'Decent but Forgettable',
          content: 'The film has its moments and the technical aspects are well-executed, but it lacks the emotional depth and originality to make it truly memorable. It\'s the kind of movie you watch once and then forget about.',
          helpfulVotes: 45,
          totalVotes: 78,
          createdAt: '2024-01-13T09:20:00Z',
          isEdited: false,
          userRating: -1
        },
        {
          id: 4,
          userId: 4,
          username: 'MovieExplorer',
          movieId: movie.id || 0,
          rating: 5,
          title: 'Absolutely Stunning!',
          content: 'I was blown away by this film. Every frame is a work of art, the soundtrack is perfect, and the emotional journey it takes you on is unforgettable. This is why I love cinema.',
          helpfulVotes: 203,
          totalVotes: 234,
          createdAt: '2024-01-12T20:15:00Z',
          isEdited: false,
          userRating: 1
        }
      ];

      const mockComments: Comment[] = [
        {
          id: 1,
          userId: 5,
          username: 'Commenter1',
          reviewId: 1,
          content: 'Great review! I completely agree about the cinematography. The use of lighting in the third act was particularly impressive.',
          helpfulVotes: 12,
          totalVotes: 15,
          createdAt: '2024-01-15T11:00:00Z',
          isEdited: false,
          userRating: 1
        },
        {
          id: 2,
          userId: 6,
          username: 'Commenter2',
          reviewId: 1,
          content: 'I disagree about the pacing. I found it quite slow in the middle section.',
          helpfulVotes: 8,
          totalVotes: 22,
          createdAt: '2024-01-15T11:30:00Z',
          isEdited: false,
          userRating: -1,
          replies: [
            {
              id: 3,
              userId: 1,
              username: 'MovieBuff2024',
              reviewId: 1,
              content: 'I can see your point about the pacing, but I think it was necessary to build the tension.',
              helpfulVotes: 5,
              totalVotes: 8,
              createdAt: '2024-01-15T12:00:00Z',
              isEdited: false,
              parentId: 2
            }
          ]
        }
      ];

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setReviews(mockReviews);
      setComments(mockComments);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!userId || reviewForm.rating === 0 || !reviewForm.title.trim() || !reviewForm.content.trim()) {
      return;
    }

    try {
      const newReview: Review = {
        id: Date.now(),
        userId,
        username: 'CurrentUser', // Replace with actual username
        movieId: movie.id || 0,
        rating: reviewForm.rating,
        title: reviewForm.title,
        content: reviewForm.content,
        helpfulVotes: 0,
        totalVotes: 0,
        createdAt: new Date().toISOString(),
        isEdited: false,
        userRating: 0
      };

      setReviews(prev => [newReview, ...prev]);
      setReviewForm({ rating: 0, title: '', content: '' });
      setActiveTab('reviews');
    } catch (error) {
      console.error('Failed to submit review:', error);
    }
  };

  const handleVoteReview = async (reviewId: number, vote: 1 | -1) => {
    setReviews(prev => prev.map(review => 
      review.id === reviewId 
        ? { 
            ...review, 
            helpfulVotes: review.helpfulVotes + (vote === 1 ? 1 : 0),
            totalVotes: review.totalVotes + 1,
            userRating: vote
          }
        : review
    ));
  };

  const handleVoteComment = async (commentId: number, vote: 1 | -1) => {
    setComments(prev => prev.map(comment => 
      comment.id === commentId 
        ? { 
            ...comment, 
            helpfulVotes: comment.helpfulVotes + (vote === 1 ? 1 : 0),
            totalVotes: comment.totalVotes + 1,
            userRating: vote
          }
        : comment
    ));
  };

  const handleSubmitComment = async () => {
    if (!userId || !commentContent.trim() || !selectedReview) return;

    try {
      const newComment: Comment = {
        id: Date.now(),
        userId,
        username: 'CurrentUser', // Replace with actual username
        reviewId: selectedReview.id,
        content: commentContent,
        helpfulVotes: 0,
        totalVotes: 0,
        createdAt: new Date().toISOString(),
        isEdited: false,
        parentId: replyTo?.id
      };

      if (replyTo) {
        // Add as reply
        setComments(prev => prev.map(comment => 
          comment.id === replyTo.id 
            ? { ...comment, replies: [...(comment.replies || []), newComment] }
            : comment
        ));
      } else {
        // Add as top-level comment
        setComments(prev => [newComment, ...prev]);
      }

      setCommentContent('');
      setReplyTo(null);
      setShowCommentForm(false);
    } catch (error) {
      console.error('Failed to submit comment:', error);
    }
  };

  const filteredReviews = reviews.filter(review => 
    filterRating === null || review.rating === filterRating
  );

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    switch (sortBy) {
      case 'helpful':
        return (b.helpfulVotes / b.totalVotes) - (a.helpfulVotes / a.totalVotes);
      case 'rating':
        return b.rating - a.rating;
      case 'recent':
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  const getReviewComments = (reviewId: number) => {
    return comments.filter(comment => comment.reviewId === reviewId && !comment.parentId);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getHelpfulPercentage = (helpful: number, total: number) => {
    return total > 0 ? Math.round((helpful / total) * 100) : 0;
  };

  if (loading) {
    return (
      <div className="movie-reviews loading">
        <div className="reviews-skeleton">
          <div className="skeleton-header"></div>
          <div className="skeleton-tabs"></div>
          <div className="skeleton-content">
            {[1, 2, 3].map(i => (
              <div key={i} className="skeleton-review"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="movie-reviews">
      <div className="reviews-header">
        <div className="header-info">
          <h2>💬 Reviews & Discussion</h2>
          <p>Share your thoughts on "{movie.title}"</p>
        </div>
        <div className="header-controls">
          {onClose && (
            <button className="close-button" onClick={onClose}>
              ✕
            </button>
          )}
        </div>
      </div>

      <div className="reviews-tabs">
        <button 
          className={`reviews-tab ${activeTab === 'reviews' ? 'active' : ''}`}
          onClick={() => setActiveTab('reviews')}
        >
          📝 Reviews ({reviews.length})
        </button>
        <button 
          className={`reviews-tab ${activeTab === 'write-review' ? 'active' : ''}`}
          onClick={() => setActiveTab('write-review')}
        >
          ✍️ Write Review
        </button>
      </div>

      <div className="reviews-body">
        {activeTab === 'reviews' && (
          <div className="reviews-content">
            <div className="reviews-filters">
              <div className="filter-group">
                <label>Sort by:</label>
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="sort-select"
                >
                  <option value="recent">Most Recent</option>
                  <option value="helpful">Most Helpful</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
              <div className="filter-group">
                <label>Filter by rating:</label>
                <select 
                  value={filterRating || ''} 
                  onChange={(e) => setFilterRating(e.target.value ? parseInt(e.target.value) : null)}
                  className="filter-select"
                >
                  <option value="">All Ratings</option>
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="1">1 Star</option>
                </select>
              </div>
            </div>

            <div className="reviews-list">
              {sortedReviews.length === 0 ? (
                <div className="no-reviews">
                  <div className="no-reviews-icon">💬</div>
                  <h3>No reviews yet</h3>
                  <p>Be the first to share your thoughts on this movie!</p>
                  <button 
                    className="write-first-review"
                    onClick={() => setActiveTab('write-review')}
                  >
                    Write the First Review
                  </button>
                </div>
              ) : (
                sortedReviews.map(review => (
                  <div key={review.id} className="review-card">
                    <div className="review-header">
                      <div className="reviewer-info">
                        <div className="reviewer-avatar">
                          {review.userAvatar ? (
                            <img src={review.userAvatar} alt={review.username} />
                          ) : (
                            <div className="avatar-placeholder">
                              {review.username.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="reviewer-details">
                          <span className="reviewer-name">{review.username}</span>
                          <span className="review-date">{formatDate(review.createdAt)}</span>
                        </div>
                      </div>
                      <div className="review-rating">
                        <div className="stars">
                          {[1, 2, 3, 4, 5].map(star => (
                            <span key={star} className={`star ${review.rating >= star ? 'filled' : ''}`}>
                              ⭐
                            </span>
                          ))}
                        </div>
                        <span className="rating-text">{review.rating}/5</span>
                      </div>
                    </div>

                    <div className="review-content">
                      <h3 className="review-title">{review.title}</h3>
                      <p className="review-text">{review.content}</p>
                    </div>

                    <div className="review-actions">
                      <div className="vote-buttons">
                        <button 
                          className={`vote-button ${review.userRating === 1 ? 'voted' : ''}`}
                          onClick={() => handleVoteReview(review.id, 1)}
                          disabled={!userId}
                        >
                          👍 Helpful ({review.helpfulVotes})
                        </button>
                        <button 
                          className={`vote-button ${review.userRating === -1 ? 'voted' : ''}`}
                          onClick={() => handleVoteReview(review.id, -1)}
                          disabled={!userId}
                        >
                          👎 Not Helpful ({review.totalVotes - review.helpfulVotes})
                        </button>
                      </div>
                      <div className="helpful-percentage">
                        {getHelpfulPercentage(review.helpfulVotes, review.totalVotes)}% found this helpful
                      </div>
                      <button 
                        className="comment-button"
                        onClick={() => {
                          setSelectedReview(review);
                          setShowCommentForm(true);
                        }}
                      >
                        💬 Comment ({getReviewComments(review.id).length})
                      </button>
                    </div>

                    {/* Comments Section */}
                    <div className="comments-section">
                      {getReviewComments(review.id).map(comment => (
                        <div key={comment.id} className="comment-item">
                          <div className="comment-header">
                            <div className="commenter-info">
                              <div className="commenter-avatar">
                                {comment.userAvatar ? (
                                  <img src={comment.userAvatar} alt={comment.username} />
                                ) : (
                                  <div className="avatar-placeholder small">
                                    {comment.username.charAt(0).toUpperCase()}
                                  </div>
                                )}
                              </div>
                              <div className="commenter-details">
                                <span className="commenter-name">{comment.username}</span>
                                <span className="comment-date">{formatDate(comment.createdAt)}</span>
                              </div>
                            </div>
                          </div>
                          <div className="comment-content">
                            <p>{comment.content}</p>
                          </div>
                          <div className="comment-actions">
                            <div className="vote-buttons">
                              <button 
                                className={`vote-button small ${comment.userRating === 1 ? 'voted' : ''}`}
                                onClick={() => handleVoteComment(comment.id, 1)}
                                disabled={!userId}
                              >
                                👍 ({comment.helpfulVotes})
                              </button>
                              <button 
                                className={`vote-button small ${comment.userRating === -1 ? 'voted' : ''}`}
                                onClick={() => handleVoteComment(comment.id, -1)}
                                disabled={!userId}
                              >
                                👎 ({comment.totalVotes - comment.helpfulVotes})
                              </button>
                            </div>
                            <button 
                              className="reply-button"
                              onClick={() => {
                                setReplyTo(comment);
                                setShowCommentForm(true);
                              }}
                            >
                              Reply
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'write-review' && (
          <div className="write-review-content">
            <div className="review-form">
              <h3>Write Your Review</h3>
              
              <div className="form-group">
                <label>Your Rating</label>
                <div className="rating-input">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      className={`star-button ${reviewForm.rating >= star ? 'selected' : ''}`}
                      onClick={() => setReviewForm(prev => ({ ...prev, rating: star }))}
                    >
                      ⭐
                    </button>
                  ))}
                  <span className="rating-text">{reviewForm.rating}/5</span>
                </div>
              </div>

              <div className="form-group">
                <label>Review Title</label>
                <input
                  type="text"
                  value={reviewForm.title}
                  onChange={(e) => setReviewForm(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Summarize your review in a few words..."
                  maxLength={100}
                />
                <span className="char-count">{reviewForm.title.length}/100</span>
              </div>

              <div className="form-group">
                <label>Review Content</label>
                <textarea
                  value={reviewForm.content}
                  onChange={(e) => setReviewForm(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Share your detailed thoughts about the movie..."
                  rows={6}
                  maxLength={1000}
                />
                <span className="char-count">{reviewForm.content.length}/1000</span>
              </div>

              <div className="form-actions">
                <button 
                  className="submit-review"
                  onClick={handleSubmitReview}
                  disabled={!userId || reviewForm.rating === 0 || !reviewForm.title.trim() || !reviewForm.content.trim()}
                >
                  Submit Review
                </button>
                <button 
                  className="cancel-review"
                  onClick={() => {
                    setReviewForm({ rating: 0, title: '', content: '' });
                    setActiveTab('reviews');
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Comment Form Modal */}
      {showCommentForm && (
        <div className="comment-modal">
          <div className="comment-modal-content">
            <div className="modal-header">
              <h3>
                {replyTo ? `Reply to ${replyTo.username}` : `Comment on "${selectedReview?.title}"`}
              </h3>
              <button 
                className="close-button"
                onClick={() => {
                  setShowCommentForm(false);
                  setReplyTo(null);
                  setCommentContent('');
                }}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <textarea
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                placeholder="Share your thoughts..."
                rows={4}
                maxLength={500}
              />
              <span className="char-count">{commentContent.length}/500</span>
            </div>
            <div className="modal-actions">
              <button 
                className="submit-comment"
                onClick={handleSubmitComment}
                disabled={!userId || !commentContent.trim()}
              >
                Submit Comment
              </button>
              <button 
                className="cancel-comment"
                onClick={() => {
                  setShowCommentForm(false);
                  setReplyTo(null);
                  setCommentContent('');
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieReviews;
