export interface Program {
  title: string;
  type: "tv" | "movie";
  imdbId: string;
  posterUrl: string;
  genres: string[];
}
