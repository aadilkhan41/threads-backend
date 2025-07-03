const app = require("./app");
const {PORT} = require("./utils/config");

app.listen(PORT, () => {
    console.log(`Server listening at port http://localhost:${PORT}`);
});