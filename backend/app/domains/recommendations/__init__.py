# Recommendations domain exports
from .controllers.recommendations import recommendations_bp
from .services.recommendation_service import RecommendationService

__all__ = ['recommendations_bp', 'RecommendationService']
