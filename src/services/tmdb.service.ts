import { env } from "@config/environment";
import { Program } from "@models/program.model";
import { GenreId, GENRES, QueryData } from "@models/tmdb.model";

export type TmdbQueryResult =
  | { success: false }
  | { success: true; program: Program };

export const findMovieByImdbId = async (
  imdbId: string,
): Promise<TmdbQueryResult> => {
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
    } = (await response.json()) as QueryData;

    if (!movie) {
      return { success: false };
    }

    return {
      success: true,
      program: { ...transformData({ data: movie, type: "movie" }), imdbId },
    };
  } else {
    throw new Error(`Request to TMDb API failed`);
  }
};

const transformData = ({
  data,
  type,
}: {
  data: any;
  type: Program["type"];
}): Omit<Program, "imdbId"> => {
  return {
    title: data.title,
    type,
    posterUrl: `https://image.tmdb.org/t/p/w500${data.poster_path}`,
    genres: data.genre_ids.map((genreId: GenreId) => GENRES[genreId]),
  };
};
