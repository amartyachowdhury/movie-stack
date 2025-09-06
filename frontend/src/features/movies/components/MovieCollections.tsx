import React, { useState, useEffect } from 'react';
import MovieCard from './MovieCard';
import { Movie } from '../../../shared/types';
import './MovieCollections.css';

interface Collection {
  id: string;
  title: string;
  description: string;
  category: 'awards' | 'genre' | 'decade' | 'theme' | 'trending';
  movies: Movie[];
  coverImage?: string;
  totalMovies: number;
}

interface MovieCollectionsProps {
  onMovieClick?: (movie: Movie) => void;
}

const MovieCollections: React.FC<MovieCollectionsProps> = ({ onMovieClick }) => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [expandedCollection, setExpandedCollection] = useState<string | null>(null);

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      const mockCollections: Collection[] = [
        {
          id: 'oscars-2024',
          title: 'Oscar Winners 2024',
          description: 'The most prestigious films of the year',
          category: 'awards',
          totalMovies: 8,
          movies: [
            { id: 1, title: 'Oppenheimer', poster_path: '/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg', vote_average: 8.1, vote_count: 5000, release_date: '2023-07-21', overview: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.', genre_ids: [18, 36], adult: false, original_language: 'en', original_title: 'Oppenheimer', popularity: 95.2, video: false },
            { id: 2, title: 'Poor Things', poster_path: '/kCGlIMHnOm8JPXq3rXM6c5wMxcT.jpg', vote_average: 7.8, vote_count: 3000, release_date: '2023-12-08', overview: 'The incredible tale about the fantastical evolution of Bella Baxter, a young woman brought back to life by the brilliant and unorthodox scientist Dr. Godwin Baxter.', genre_ids: [35, 18, 14], adult: false, original_language: 'en', original_title: 'Poor Things', popularity: 78.5, video: false },
            { id: 3, title: 'Killers of the Flower Moon', poster_path: '/dB6Krk806zeqd0nppXgT7RMRFth.jpg', vote_average: 7.6, vote_count: 4000, release_date: '2023-10-20', overview: 'When oil is discovered in 1920s Oklahoma under Osage Nation land, the Osage people are murdered one by one—until the FBI steps in to unravel the mystery.', genre_ids: [80, 18, 36], adult: false, original_language: 'en', original_title: 'Killers of the Flower Moon', popularity: 82.1, video: false }
          ]
        },
        {
          id: 'sci-fi-classics',
          title: 'Sci-Fi Classics',
          description: 'Timeless science fiction masterpieces',
          category: 'genre',
          totalMovies: 12,
          movies: [
            { id: 4, title: 'Blade Runner', poster_path: '/63N9uy8nd9j7Eog2YPQ3ZqBktu2.jpg', vote_average: 8.1, vote_count: 8000, release_date: '1982-06-25', overview: 'A blade runner must pursue and terminate four replicants who stole a ship in space, and have returned to Earth to find their creator.', genre_ids: [878, 18, 53], adult: false, original_language: 'en', original_title: 'Blade Runner', popularity: 75.8, video: false },
            { id: 5, title: 'The Matrix', poster_path: '/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg', vote_average: 8.7, vote_count: 12000, release_date: '1999-03-31', overview: 'A computer programmer discovers that reality as he knows it is a simulation created by machines, and joins a rebellion to break free.', genre_ids: [28, 878, 53], adult: false, original_language: 'en', original_title: 'The Matrix', popularity: 89.2, video: false },
            { id: 6, title: '2001: A Space Odyssey', poster_path: '/ve72VxNqjGM69Uky4WTo2bK6rfO.jpg', vote_average: 8.3, vote_count: 10000, release_date: '1968-04-02', overview: 'Humanity finds a mysterious, obviously artificial object buried beneath the Lunar surface and, with the intelligent computer H.A.L. 9000, sets off on a quest.', genre_ids: [878, 18, 9648], adult: false, original_language: 'en', original_title: '2001: A Space Odyssey', popularity: 82.4, video: false }
          ]
        },
        {
          id: '90s-nostalgia',
          title: '90s Nostalgia',
          description: 'Iconic films from the golden decade',
          category: 'decade',
          totalMovies: 15,
          movies: [
            { id: 7, title: 'Pulp Fiction', poster_path: '/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg', vote_average: 8.9, vote_count: 15000, release_date: '1994-10-14', overview: 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.', genre_ids: [80, 18], adult: false, original_language: 'en', original_title: 'Pulp Fiction', popularity: 91.5, video: false },
            { id: 8, title: 'The Shawshank Redemption', poster_path: '/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg', vote_average: 9.3, vote_count: 20000, release_date: '1994-09-22', overview: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.', genre_ids: [18, 80], adult: false, original_language: 'en', original_title: 'The Shawshank Redemption', popularity: 95.8, video: false },
            { id: 9, title: 'Fight Club', poster_path: '/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg', vote_average: 8.8, vote_count: 18000, release_date: '1999-10-15', overview: 'An insomniac office worker and a devil-may-care soapmaker form an underground fight club that evolves into something much, much more.', genre_ids: [18, 53], adult: false, original_language: 'en', original_title: 'Fight Club', popularity: 88.2, video: false }
          ]
        },
        {
          id: 'christmas-movies',
          title: 'Christmas Classics',
          description: 'Heartwarming holiday favorites',
          category: 'theme',
          totalMovies: 10,
          movies: [
            { id: 10, title: 'It\'s a Wonderful Life', poster_path: '/q4jJepO0G8izd6LnwMhiVA2LtJV.jpg', vote_average: 8.6, vote_count: 6000, release_date: '1946-12-20', overview: 'An angel is sent from Heaven to help a desperately frustrated businessman by showing him what life would have been like if he had never existed.', genre_ids: [18, 14, 10751], adult: false, original_language: 'en', original_title: 'It\'s a Wonderful Life', popularity: 68.3, video: false },
            { id: 11, title: 'Home Alone', poster_path: '/9wSbe4CwObACCQvaUVhWQyLR5Yz.jpg', vote_average: 7.6, vote_count: 8000, release_date: '1990-11-16', overview: 'When 8-year-old Kevin is accidentally left behind while his family flies to Paris for Christmas vacation, he must defend his home against bumbling burglars.', genre_ids: [35, 10751, 80], adult: false, original_language: 'en', original_title: 'Home Alone', popularity: 72.1, video: false },
            { id: 12, title: 'Elf', poster_path: '/g6st9aJUJVVpwnEh8jJ3UrK5MNM.jpg', vote_average: 7.1, vote_count: 5000, release_date: '2003-11-07', overview: 'Buddy, a human raised as an elf at the North Pole, travels to New York City to meet his biological father, spreading Christmas cheer in a world of cynics.', genre_ids: [35, 14, 10751], adult: false, original_language: 'en', original_title: 'Elf', popularity: 65.7, video: false }
          ]
        },
        {
          id: 'trending-now',
          title: 'Trending Now',
          description: 'What everyone is watching this week',
          category: 'trending',
          totalMovies: 6,
          movies: [
            { id: 13, title: 'Dune: Part Two', poster_path: '/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg', vote_average: 8.4, vote_count: 4000, release_date: '2024-03-01', overview: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.', genre_ids: [878, 18, 12], adult: false, original_language: 'en', original_title: 'Dune: Part Two', popularity: 96.8, video: false },
            { id: 14, title: 'Poor Things', poster_path: '/kCGlIMHnOm8JPXq3rXM6c5wMxcT.jpg', vote_average: 7.8, vote_count: 3000, release_date: '2023-12-08', overview: 'The incredible tale about the fantastical evolution of Bella Baxter, a young woman brought back to life by the brilliant and unorthodox scientist Dr. Godwin Baxter.', genre_ids: [35, 18, 14], adult: false, original_language: 'en', original_title: 'Poor Things', popularity: 78.5, video: false },
            { id: 15, title: 'The Zone of Interest', poster_path: '/hUu9zyEjDl4CdMhDJgx6T5dQUVl.jpg', vote_average: 7.5, vote_count: 2000, release_date: '2023-12-15', overview: 'The commandant of Auschwitz, Rudolf Höss, and his wife Hedwig, strive to build a dream life for their family in a house and garden next to the camp.', genre_ids: [18, 36, 53], adult: false, original_language: 'en', original_title: 'The Zone of Interest', popularity: 71.2, video: false }
          ]
        }
      ];

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      setCollections(mockCollections);
    } catch (error) {
      console.error('Failed to fetch collections:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: 'all', label: 'All Collections', icon: '🎬' },
    { id: 'awards', label: 'Awards', icon: '🏆' },
    { id: 'genre', label: 'Genres', icon: '🎭' },
    { id: 'decade', label: 'Decades', icon: '📅' },
    { id: 'theme', label: 'Themes', icon: '🎨' },
    { id: 'trending', label: 'Trending', icon: '🔥' }
  ];

  const filteredCollections = activeCategory === 'all' 
    ? collections 
    : collections.filter(collection => collection.category === activeCategory);

  const toggleCollection = (collectionId: string) => {
    setExpandedCollection(expandedCollection === collectionId ? null : collectionId);
  };

  if (loading) {
    return (
      <div className="movie-collections loading">
        <div className="collections-skeleton">
          <div className="skeleton-header"></div>
          <div className="skeleton-categories">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="skeleton-category"></div>
            ))}
          </div>
          <div className="skeleton-collections">
            {[1, 2, 3].map(i => (
              <div key={i} className="skeleton-collection"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="movie-collections">
      <div className="collections-header">
        <h2>Movie Collections</h2>
        <p>Discover curated lists of amazing films</p>
      </div>

      <div className="category-filters">
        {categories.map(category => (
          <button
            key={category.id}
            className={`category-filter ${activeCategory === category.id ? 'active' : ''}`}
            onClick={() => setActiveCategory(category.id)}
          >
            <span className="category-icon">{category.icon}</span>
            <span className="category-label">{category.label}</span>
          </button>
        ))}
      </div>

      <div className="collections-grid">
        {filteredCollections.map(collection => (
          <div key={collection.id} className="collection-card">
            <div className="collection-header">
              <div className="collection-info">
                <h3>{collection.title}</h3>
                <p>{collection.description}</p>
                <span className="movie-count">{collection.totalMovies} movies</span>
              </div>
              <button
                className="expand-button"
                onClick={() => toggleCollection(collection.id)}
                aria-label={expandedCollection === collection.id ? 'Collapse' : 'Expand'}
              >
                {expandedCollection === collection.id ? '−' : '+'}
              </button>
            </div>

            <div className="collection-movies">
              <div className="movies-preview">
                {collection.movies.slice(0, 3).map(movie => (
                  <div key={movie.id} className="movie-preview">
                    <img 
                      src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                      alt={movie.title}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder-movie.jpg';
                      }}
                    />
                  </div>
                ))}
                {collection.totalMovies > 3 && (
                  <div className="more-movies">
                    <span>+{collection.totalMovies - 3}</span>
                  </div>
                )}
              </div>

              {expandedCollection === collection.id && (
                <div className="expanded-movies">
                  <div className="movies-grid">
                    {collection.movies.map(movie => (
                      <MovieCard
                        key={movie.id}
                        movie={movie}
                        onMovieClick={() => onMovieClick?.(movie)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="collection-actions">
              <button 
                className="view-all-button"
                onClick={() => toggleCollection(collection.id)}
              >
                {expandedCollection === collection.id ? 'Show Less' : 'View All Movies'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredCollections.length === 0 && (
        <div className="no-collections">
          <div className="no-collections-icon">🎬</div>
          <h3>No collections found</h3>
          <p>Try selecting a different category or check back later for new collections.</p>
        </div>
      )}
    </div>
  );
};

export default MovieCollections;
