import { QueryData } from "@models/tmdb.model";
import { http, HttpResponse } from "msw";

export const handlers = [
  http.get("https://api.themoviedb.org/3/find/*", () => {
    return HttpResponse.json({
      movie_results: [
        {
          title: "Movie title",
          poster_path: "/movie_poster.jpg",
          genre_ids: [28, 10759, 12],
        },
      ],
      tv_results: [],
    } as QueryData);
  }),
];
