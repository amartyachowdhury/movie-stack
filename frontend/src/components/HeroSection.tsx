import React from 'react';
import './HeroSection.css';

interface Movie {
  id?: number;
  tmdb_id?: number;
  title: string;
  overview?: string;
  poster_path?: string;
  release_date?: string;
  vote_average?: number;
  genre_ids?: number[];
}

interface HeroSectionProps {
  featuredMovies?: Movie[];
  loading?: boolean;
}

const HeroSection: React.FC<HeroSectionProps> = ({ 
  featuredMovies = [], 
  loading = false 
}) => {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <h1 className="hero-title">Movie Stack</h1>
        <p className="hero-subtitle">Discover. Watch. Review. Repeat.</p>
        {loading && <div className="hero-loading">Loading featured movies...</div>}
        {!loading && featuredMovies.length > 0 && (
          <div className="hero-featured">
            <p>Featured: {featuredMovies[0]?.title}</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroSection;
