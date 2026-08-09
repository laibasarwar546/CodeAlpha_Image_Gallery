export default async function handler(req, res) {
    const { query = "nature", page = "1", per_page = "30" } = req.query;

    try {
        const response = await fetch(
            `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&page=${page}&per_page=${per_page}`,
            {
                headers: {
                    Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json({
                error: data.errors?.[0] || "Unsplash API request failed"
            });
        }

        return res.status(200).json(data);

    } catch (error) {
        return res.status(500).json({
            error: "Server error while fetching images"
        });
    }
}
