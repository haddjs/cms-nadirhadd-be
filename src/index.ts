import "dotenv/config"
import app from "./server"
import "./config/db"
import "./config/cloudinary"

app.listen(3000, () => {
    console.log("server is running on port 3000");
})