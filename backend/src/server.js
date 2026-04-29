import app from "./app.js";
import { env } from "./config/env.js";
import { verifyMailerConnection } from "./services/mailer.service.js";

app.listen(env.port, () => {
  console.log(`Server is running on http://localhost:${env.port}`);
});

if (env.nodeEnv !== "test") {
  verifyMailerConnection()
    .then((result) => {
      if (result.ok) console.log("[mailer] Mailer ready");
    })
    .catch(() => {});
}
