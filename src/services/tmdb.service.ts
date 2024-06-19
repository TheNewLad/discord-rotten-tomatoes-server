import { env } from "@config/environment";
import { Program } from "@models/program.model";
import { ServiceResult } from "@models/service-result.model";
import { GenreId, GENRES, QueryData } from "@models/tmdb.model";

export const findMovieByImdbId = async (
  imdbId: string,
): Promise<ServiceResult<Program>> => {
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
      return { error: "Failed to fetch movie data" };
    }

    return {
      data: { ...transformData({ data: movie, type: "movie" }), imdbId },
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
