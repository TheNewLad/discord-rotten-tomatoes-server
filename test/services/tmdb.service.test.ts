import { server } from "@mocks/node";
import { type Program } from "@models/program.model";
import { TmdbService } from "@services/tmdb.service";
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";

describe("TmdbService", () => {
  it("should return movie data when present", async () => {
    const imdbId = "tt123456";

    const result = await TmdbService.getMovie(imdbId);
    const { data } = result as { data: Program };

    expect(data).toMatchObject<Program>({
      title: "Movie title",
      type: "movie",
      imdbId,
      posterUrl: "https://image.tmdb.org/t/p/w500/movie_poster.jpg",
      genres: ["Action", "Action & Adventure", "Adventure"],
    });
  });

  it("should return error and no data", async () => {
    const imdbId = "tt654321";

    server.use(
      http.get(`https://api.themoviedb.org/3/find/${imdbId}`, () => {
        return HttpResponse.json({ movie_results: [] });
      }),
    );

    const result = await TmdbService.getMovie(imdbId);

    expect(result).toMatchObject({ error: "Failed to fetch movie data" });
  });

  it("should throw an error when request fails", async () => {
    const imdbId = "tt654321";

    server.use(
      http.get(`https://api.themoviedb.org/3/find/${imdbId}`, () => {
        return new HttpResponse(null, {
          status: 500,
          statusText: "Test Server Error",
        });
      }),
    );

    await expect(TmdbService.getMovie(imdbId)).rejects.toThrow(
      "Request to TMDb API failed",
    );
  });
});
