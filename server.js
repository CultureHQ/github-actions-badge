const express = require("express");
const app = express();

const getRedirect = require("./getRedirect");

app.use((request, response, next) => {
  console.log(`[${new Date().toUTCString()}] ${request.method} ${request.path}`);

  next();
});

app.get("/:owner/:repo", (request, response) => {
  getRedirect(request.params.owner, request.params.repo, request.query)
    .then(redirect => {
      response.header("Cache-Control", "no-cache");
      response.redirect(303, redirect);
    })
    .catch(error => {
      if (error.message.startsWith("Could not find")) {
        response.status(404).send("Not found");
      } else {
        response.status(500).send(error.message);
      }
    });
});

app.listen(8080, () => console.log("Listening on port 8080..."));
