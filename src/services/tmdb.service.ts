import { env } from "@config/environment";
import { Program } from "@models/program.model";

export class TmdbService {
  public static async getMovie(imdbId: string): Promise<Program> {
    const response = await fetch(
      `https://api.themoviedb.org/3/find/${imdbId}?external_source=imdb_id`,
      {
        headers: {
          Authorization: `Bearer ${env.TMDB_API_KEY}`,
          "Content-Type": "application/json",
        },
        method: "GET",
      },
    );

    if (response.ok) {
      const {
        movie_results: [movie],
      } = await response.json();

      return { ...this.transformMovieData(movie), imdbId };
    } else {
      throw new Error("Failed to fetch movie data");
    }
  }

  private static transformMovieData(data: any): Omit<Program, "imdbId"> {
    return {
      title: data.title,
      type: "movie",
      posterUrl: `https://image.tmdb.org/t/p/w500${data.poster_path}`,
      genres: data.genre_ids.map(
        (genreId: keyof typeof genres) => genres[genreId],
      ),
    };
  }
}

const genres = {
  "28": "Action",
  "10759": "Action & Adventure",
  "12": "Adventure",
  "16": "Animation",
  "35": "Comedy",
  "80": "Crime",
  "99": "Documentary",
  "18": "Drama",
  "14": "Fantasy",
  "36": "History",
  "27": "Horror",
  "10762": "Kids",
  "10402": "Music",
  "9648": "Mystery",
  "10763": "News",
  "10764": "Reality",
  "10749": "Romance",
  "878": "Science Fiction",
  "10765": "Sci-Fi & Fantasy",
  "10766": "Soap",
  "10767": "Talk",
  "53": "Thriller",
  "10770": "TV Movie",
  "10768": "War & Politics",
  "10752": "War",
  "10751": "Family",
  "37": "Western",
};
