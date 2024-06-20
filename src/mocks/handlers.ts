import { env } from "@config/environment";
import { QueryData } from "@models/tmdb.model";
import { http, HttpResponse } from "msw";

const tmdbHandlers = [
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

const discordHandlers = [
  http.get(
    `https://discord.com/api/users/@me/guilds/${env.DISCORD_SERVER_ID}/member`,
    () => HttpResponse.json({ user: { id: "discord-user-id" } }),
  ),
];

const supabaseHandlers = [
  http.post(`${env.SUPABASE_URL}/rest/v1/users`, ({ request }) => {
    const url = new URL(request.url);
    const onConflict = url.searchParams.get("on_conflict");
    const select = url.searchParams.get("select");

    if (onConflict === "discord_user_id" && select === "*") {
      return HttpResponse.json({
        data: [
          {
            clerk_user_id: "",
            created_at: "",
            discord_user_id: "",
            id: 0,
            review_weights: "",
          },
        ],
      });
    }
  }),
];

export const handlers = [
  ...tmdbHandlers,
  ...discordHandlers,
  ...supabaseHandlers,
];
