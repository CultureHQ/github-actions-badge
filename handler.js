const getRedirect = require("./getRedirect");
const { getLatestRunURL } = require("./githubClient");

const process = (promise, callback) =>
  promise
    .then(({ url, etag }) =>
      callback(null, {
        statusCode: 303,
        headers: {
          "Cache-Control": "no-cache",
          ETag: etag,
          Location: url
        }
      })
    )
    .catch(error => {
      if (error.message.startsWith("Could not find")) {
        callback(null, { statusCode: 404 });
      } else {
        callback(null, { statusCode: 500 });
      }
    });

const handle = (event, context, callback) => {
  const { owner, repo } = event.pathParameters;
  const { branch, ...query } = event.queryStringParameters || {};

  if (event.path.startsWith("/badge")) {
    return process(getRedirect(owner, repo, query, branch), callback);
  }

  if (event.path.startsWith("/results")) {
    return process(getLatestRunURL(owner, repo, branch), callback);
  }

  callback(null, { statusCode: 404 });
};

module.exports = { handle };
