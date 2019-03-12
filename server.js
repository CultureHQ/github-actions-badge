const express = require("express");
const app = express();

const getRedirect = require("./getRedirect");
const { getLatestRunURL } = require("./githubClient");

const process = (promise, response) => (
  promise
    .then(({ url, etag }) => {
      response.header("Cache-Control", "no-cache");
      response.header("ETag", etag);
      response.redirect(303, url);
    })
    .catch(error => {
      if (error.message.startsWith("Could not find")) {
        response.status(404).send("Not found");
      } else {
        response.status(500).send(error.message);
      }
    })
);

app.use((request, response, next) => {
  console.log(`[${new Date().toUTCString()}] ${request.method} ${request.path}`);

  next();
});

app.get("/:owner/:repo", (request, response) => {
  process(getRedirect(request.params.owner, request.params.repo, request.query), response);
});

app.get("/results/:owner/:repo", (request, response) => {
  process(getLatestRunURL(request.params.owner, request.params.repo), response);
});

app.listen(8080, () => console.log("Listening on port 8080..."));
