import { type Program } from "@models/program.model";
import { TmdbService } from "@services/tmdb.service";
import { describe, expect, it } from "vitest";

describe("TmdbService", () => {
  it("should return movie data", async () => {
    const imdbId = "tt123456";
    const movieData = await TmdbService.getMovie(imdbId);

    expect(movieData).toMatchObject<Program>({
      title: "Movie title",
      type: "movie",
      imdbId,
      posterUrl: "https://image.tmdb.org/t/p/w500/movie_poster.jpg",
      genres: ["Action", "Action & Adventure", "Adventure"],
    });
  });
});
