import { type Program } from "@models/program.model";
import { TmdbService } from "@services/tmdb.service";
import { describe, expect, it } from "vitest";

describe("TmdbService", () => {
  it("should return movie data", async () => {
    const movieData = await TmdbService.getMovie("tt12311620");

    expect(movieData).toBeDefined();
    expect(movieData).toMatchObject<Program>({
      title: expect.any(String),
      type: "movie",
      imageSrc: expect.any(String),
      imdbId: "tt12311620",
      posterUrl: expect.any(String),
      genres: expect.any(Array),
    });
  });
});
