# Discord Rotten Tomatoes Server

This API allows users to sign in with Discord to access and rate TV shows and movies for a specific Discord server. This project aims to provide Discord server-specific reviews, search functionality, commenting, and personalized rating weightings.

## Technologies Used

- **Frontend [(Link)](https://github.com/TheNewLad/discord-rotten-tomatoes-client)**: React, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: Supabase
- **Authentication**: Clerk, Discord OAuth
- **API Integration**: TMDB API for fetching movie details
- **Testing**: Vitest, React Testing Library

## How to Run the Project

### Prerequisites

Ensure you have the following installed:

- Node.js (v14 or higher)
- npm or yarn
- Clerk account for authentication
- Supabase account for user data
- TMDB API key

### Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/TheNewLad/discord-rotten-tomatoes-server.git
   cd discord-rotten-tomatoes-server
   ```

2. **Install dependencies**

   Using npm:

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env` file in the root directory and add the following:

   ```env
   DISCORD_CLIENT_ID=your_discord_client_id
   DISCORD_CLIENT_SECRET=your_discord_client_secret
   DISCORD_SERVER_ID=your_discord_server
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_key
   TMDB_API_KEY=your_tmdb_api_key
   PORT=port_to_run_server // defaults to 4000 if not provided
   ```

4. **Start the development server**

   Using npm:

   ```bash
   npm start
   ```

   The server should now be running at `http://localhost:3000`.

### Running Tests

To run the tests, use:

```bash
npm test
```

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes.

## License

This project is licensed under the MIT License.
