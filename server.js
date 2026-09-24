const express = require("express");

const app = express();

const PORT = process.env.PORT || 3000;
const API_KEY = process.env.YOUTUBE_API_KEY;

app.use(express.json());

app.get("/", (req, res) => {
    res.send("🎵 Hazel's YouTube Music Server is running!");
});

app.get("/api/search", async (req, res) => {
    try {
        const query = req.query.q;

        if (!query) {
            return res.status(400).json({
                error: "Please enter a song to search for."
            });
        }

        if (!API_KEY) {
            return res.status(500).json({
                error: "YouTube API key is not configured."
            });
        }

        const url =
            "https://www.googleapis.com/youtube/v3/search" +
            "?part=snippet" +
            "&type=video" +
            "&maxResults=10" +
            "&q=" + encodeURIComponent(query) +
            "&key=" + API_KEY;

        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json(data);
        }

        const videos = data.items.map(item => ({
            videoId: item.id.videoId,
            title: item.snippet.title,
            thumbnail: item.snippet.thumbnails.medium.url
        }));

        res.json(videos);

    } catch (error) {
        console.error("YouTube search error:", error);

        res.status(500).json({
            error: "Something went wrong searching YouTube."
        });
    }
});

app.listen(PORT, () => {
    console.log(`🎵 Hazel's music server running on port ${PORT}`);
});
