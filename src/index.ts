import "dotenv/config"
import app from "./server"
import "./config/db"

app.listen(3000, () => {
    console.log("server is running on port 3000");
})