const express = require("express");
const app = express();

const getRedirect = require("./getRedirect");
const { getLatestRunURL } = require("./githubClient");

const process = (promise, response) =>
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
    });

app.use((request, response, next) => {
  const timestamp = new Date().toUTCString();
  console.log(`[${timestamp}] ${request.method} ${request.path}`);

  next();
});

app.get("/results/:owner/:repo", (request, response) => {
  const { owner, repo } = request.params;
  const { branch } = request.query;

  process(getLatestRunURL(owner, repo, branch), response);
});

app.get("/:owner/:repo", (request, response) => {
  const { owner, repo } = request.params;
  const { branch, ...query } = request.query;

  process(getRedirect(owner, repo, query, branch), response);
});

app.listen(8080, () => console.log("Listening on port 8080..."));
