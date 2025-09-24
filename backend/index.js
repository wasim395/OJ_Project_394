const express = require("express");
const app = express();
const { DBConnection } = require("./database/db");
const cors = require('cors');
const cookieParser = require('cookie-parser');

DBConnection();

app.use(cors({
    origin: function (origin, callback) {
        callback(null, true);
    },
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const homeRoutes = require("./routes/homeRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const compilerRoutes = require("./routes/compilerRoutes");
const generateRoutes = require("./routes/generatorRoutes.js");
const superAdminRoutes = require("./routes/superAdminRoute");


app.use("/", homeRoutes);
app.use("/user", userRoutes);
app.use("/admin", adminRoutes);
app.use("/compiler", compilerRoutes);
app.use("/automate", generateRoutes);
app.use("/super-admin", superAdminRoutes);

app.listen(process.env.PORT, () => {
    console.log(`The server is listening from ${process.env.PORT}`);
});
