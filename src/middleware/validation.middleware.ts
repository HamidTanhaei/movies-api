import { Request, Response, NextFunction } from 'express';
import { body, query, validationResult } from 'express-validator';

export const validateMovieCreate = [
  body('title').trim().isLength({ min: 1, max: 255 }).withMessage('Title is required and must be less than 255 characters'),
  body('imdb_code').optional().isLength({ min: 1, max: 20 }).withMessage('IMDB code must be less than 20 characters'),
  body('year').optional().isInt({ min: 1900, max: new Date().getFullYear() }).withMessage('Year must be between 1900 and current year'),
  body('rating').optional().isFloat({ min: 0, max: 10 }).withMessage('Rating must be between 0 and 10'),
  body('genres').optional().isArray().withMessage('Genres must be an array of genre IDs'),
  body('qualities').optional().isArray().withMessage('Qualities must be an array of quality IDs'),
  body('download_count').optional().isInt({ min: 0 }).withMessage('Download count must be a non-negative integer'),
  body('like_count').optional().isInt({ min: 0 }).withMessage('Like count must be a non-negative integer'),
  body('rotten_tomatoes_rating').optional().isFloat({ min: 0, max: 100 }).withMessage('Rotten Tomatoes rating must be between 0 and 100'),
  body('directors').optional().isArray().withMessage('Directors must be an array of director IDs'),
  body('cast').optional().isLength({ max: 1000 }).withMessage('Cast must be less than 1000 characters'),
  body('synopsis').optional().isLength({ max: 2000 }).withMessage('Synopsis must be less than 2000 characters'),
  body('poster_url').optional().isURL().withMessage('Poster URL must be a valid URL'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    next();
  }
];

export const validateMovieUpdate = [
  body('title').optional().trim().isLength({ min: 1, max: 255 }).withMessage('Title must be less than 255 characters'),
  body('imdb_code').optional().isLength({ min: 1, max: 20 }).withMessage('IMDB code must be less than 20 characters'),
  body('year').optional().isInt({ min: 1900, max: new Date().getFullYear() }).withMessage('Year must be between 1900 and current year'),
  body('rating').optional().isFloat({ min: 0, max: 10 }).withMessage('Rating must be between 0 and 10'),
  body('genres').optional().isArray().withMessage('Genres must be an array of genre IDs'),
  body('qualities').optional().isArray().withMessage('Qualities must be an array of quality IDs'),
  body('download_count').optional().isInt({ min: 0 }).withMessage('Download count must be a non-negative integer'),
  body('like_count').optional().isInt({ min: 0 }).withMessage('Like count must be a non-negative integer'),
  body('rotten_tomatoes_rating').optional().isFloat({ min: 0, max: 100 }).withMessage('Rotten Tomatoes rating must be between 0 and 100'),
  body('directors').optional().isArray().withMessage('Directors must be an array of director IDs'),
  body('cast').optional().isLength({ max: 1000 }).withMessage('Cast must be less than 1000 characters'),
  body('synopsis').optional().isLength({ max: 2000 }).withMessage('Synopsis must be less than 2000 characters'),
  body('poster_url').optional().isURL().withMessage('Poster URL must be a valid URL'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    next();
  }
];

export const validateSearchParams = [
  query('title').optional().isLength({ max: 255 }).withMessage('Title search must be less than 255 characters'),
  query('imdb_code').optional().isLength({ max: 20 }).withMessage('IMDB code must be less than 20 characters'),
  query('actor').optional().isLength({ max: 255 }).withMessage('Actor search must be less than 255 characters'),
  query('director').optional().isLength({ max: 255 }).withMessage('Director search must be less than 255 characters'),
  query('quality').optional().custom((value) => {
    if (Array.isArray(value)) {
      return value.every(q => ['480p', '720p', '1080p', '2160p', '3D'].includes(q));
    }
    return ['480p', '720p', '1080p', '2160p', '3D'].includes(value);
  }).withMessage('Quality must be one or more of: 480p, 720p, 1080p, 2160p, 3D'),
  query('genre').optional().custom((value) => {
    if (Array.isArray(value)) {
      return value.every(g => typeof g === 'string' && g.length <= 255);
    }
    return typeof value === 'string' && value.length <= 255;
  }).withMessage('Genre search must be less than 255 characters'),
  query('min_rating').optional().isFloat({ min: 0, max: 10 }).withMessage('Min rating must be between 0 and 10'),
  query('max_rating').optional().isFloat({ min: 0, max: 10 }).withMessage('Max rating must be between 0 and 10'),
  query('min_year').optional().isInt({ min: 1900, max: new Date().getFullYear() }).withMessage('Min year must be between 1900 and current year'),
  query('max_year').optional().isInt({ min: 1900, max: new Date().getFullYear() }).withMessage('Max year must be between 1900 and current year'),
  query('sort_by').optional().isIn(['rating', 'year', 'download_count', 'like_count', 'title']).withMessage('Sort by must be one of: rating, year, download_count, like_count, title'),
  query('sort_order').optional().isIn(['asc', 'desc']).withMessage('Sort order must be asc or desc'),
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    next();
  }
];
