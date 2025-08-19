"""
Pagination utility functions
"""
from flask import request
from typing import Dict, Any

def paginate(query, page: int = None, per_page: int = None, max_per_page: int = 100):
    """Apply pagination to a query"""
    if page is None:
        page = request.args.get('page', 1, type=int)
    if per_page is None:
        per_page = request.args.get('per_page', 20, type=int)
    
    # Ensure per_page doesn't exceed max_per_page
    per_page = min(per_page, max_per_page)
    
    return query.paginate(
        page=page,
        per_page=per_page,
        error_out=False
    )

def get_pagination_info(pagination) -> Dict[str, Any]:
    """Get pagination information from a pagination object"""
    return {
        'page': pagination.page,
        'pages': pagination.pages,
        'per_page': pagination.per_page,
        'total': pagination.total,
        'has_next': pagination.has_next,
        'has_prev': pagination.has_prev,
        'next_num': pagination.next_num,
        'prev_num': pagination.prev_num
    }
