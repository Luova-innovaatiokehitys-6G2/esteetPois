const express = require("express");
const pool = require("./db");

const app = express();
const PORT = 3000;

app.get("/locations", async (req: any, res: any) => {
    try {
        const result = await pool.query("SELECT * FROM locations");
        res.json({ coordinates: result.rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch locations" });
    }
});

app.get("/entrance-locations", async (req: any, res: any) => {
    try {
        const result = await pool.query("SELECT * FROM entrance_locations");
        res.json({ entranceCoordinates: result.rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch entrance locations" });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));