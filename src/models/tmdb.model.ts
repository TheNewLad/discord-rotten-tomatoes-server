export interface QueryData {
  movie_results: Movie[];
  tv_results: TV[];
}

interface Movie {
  title: string;
  poster_path: string;
  genre_ids: GenreId[];
}

interface TV {
  title: string;
  poster_path: string;
  genre_ids: GenreId[];
}

export type GenreId = keyof typeof GENRES;

export const GENRES: { [key: number]: string } = {
  28: "Action",
  10759: "Action & Adventure",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10762: "Kids",
  10402: "Music",
  9648: "Mystery",
  10763: "News",
  10764: "Reality",
  10749: "Romance",
  878: "Science Fiction",
  10765: "Sci-Fi & Fantasy",
  10766: "Soap",
  10767: "Talk",
  53: "Thriller",
  10770: "TV Movie",
  10768: "War & Politics",
  10752: "War",
  10751: "Family",
  37: "Western",
} as const;
