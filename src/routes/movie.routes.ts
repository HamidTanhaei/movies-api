import { Router, Request, Response, NextFunction } from 'express';
import { MovieService } from '../services/movie.service';
import { validateMovieCreate, validateMovieUpdate, validateSearchParams } from '../middleware/validation.middleware';

const router = Router();

const getMovieService = () => new MovieService();

router.get('/search', validateSearchParams, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const searchParams = {
      title: req.query.title as string,
      imdb_code: req.query.imdb_code as string,
      actor: req.query.actor as string,
      director: req.query.director as string,
      quality: req.query.quality as string,
      genre: req.query.genre as string,
      min_rating: req.query.min_rating ? parseFloat(req.query.min_rating as string) : undefined,
      max_rating: req.query.max_rating ? parseFloat(req.query.max_rating as string) : undefined,
      min_year: req.query.min_year ? parseInt(req.query.min_year as string) : undefined,
      max_year: req.query.max_year ? parseInt(req.query.max_year as string) : undefined,
      sort_by: req.query.sort_by as 'rating' | 'year' | 'download_count' | 'like_count' | 'title',
      sort_order: req.query.sort_order as 'asc' | 'desc',
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 20
    };

    const movieService = getMovieService();
    const result = await movieService.searchMovies(searchParams);
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
});

router.get('/quality/:quality', async (req, res, next) => {
  try {
    const { quality } = req.params;
    const movieService = getMovieService();
    const movies = await movieService.getMoviesByQuality(quality);
    res.json({
      success: true,
      data: movies
    });
  } catch (error) {
    next(error);
  }
});

router.get('/top-rated', async (req, res, next) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const movieService = getMovieService();
    const movies = await movieService.getTopRatedMovies(limit);
    res.json({
      success: true,
      data: movies
    });
  } catch (error) {
    next(error);
  }
});

router.get('/year/:year', async (req, res, next) => {
  try {
    const year = parseInt(req.params.year);
    if (isNaN(year)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid year parameter'
      });
    }
    const movieService = getMovieService();
    const movies = await movieService.getMoviesByYear(year);
    res.json({
      success: true,
      data: movies
    });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid movie ID'
      });
    }

    const movieService = getMovieService();
    const movie = await movieService.getMovieById(id);
    if (!movie) {
      return res.status(404).json({
        success: false,
        error: 'Movie not found'
      });
    }

    res.json({
      success: true,
      data: movie
    });
  } catch (error) {
    next(error);
  }
});

router.get('/imdb/:imdbCode', async (req, res, next) => {
  try {
    const { imdbCode } = req.params;
    const movieService = getMovieService();
    const movie = await movieService.getMovieByImdbCode(imdbCode);
    
    if (!movie) {
      return res.status(404).json({
        success: false,
        error: 'Movie not found'
      });
    }

    res.json({
      success: true,
      data: movie
    });
  } catch (error) {
    next(error);
  }
});

router.post('/', validateMovieCreate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const movieService = getMovieService();
    const movie = await movieService.createMovie(req.body);
    res.status(201).json({
      success: true,
      data: movie
    });
  } catch (error) {
    next(error);
  }
});

router.put('/:id', validateMovieUpdate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid movie ID'
      });
    }

    const movieService = getMovieService();
    const movie = await movieService.updateMovie(id, req.body);
    if (!movie) {
      return res.status(404).json({
        success: false,
        error: 'Movie not found'
      });
    }

    res.json({
      success: true,
      data: movie
    });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid movie ID'
      });
    }

    const movieService = getMovieService();
    const deleted = await movieService.deleteMovie(id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: 'Movie not found'
      });
    }

    res.json({
      success: true,
      message: 'Movie deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

router.post('/:id/download', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid movie ID'
      });
    }

    const movieService = getMovieService();
    await movieService.incrementDownloadCount(id);
    res.json({
      success: true,
      message: 'Download count incremented'
    });
  } catch (error) {
    next(error);
  }
});

router.post('/:id/like', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid movie ID'
      });
    }

    const movieService = getMovieService();
    await movieService.incrementLikeCount(id);
    res.json({
      success: true,
      message: 'Like count incremented'
    });
  } catch (error) {
    next(error);
  }
});

export default router;
