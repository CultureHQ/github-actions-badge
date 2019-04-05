const getRedirect = require("./getRedirect");
const { getLatestRunURL } = require("./githubClient");

const process = (promise, callback) => (
  promise
    .then(({ url, etag }) => callback(null, {
      statusCode: 303,
      headers: {
        "Cache-Control": "no-cache",
        "ETag": etag,
        Location: url
      }
    }))
    .catch(error => {
      if (error.message.startsWith("Could not find")) {
        callback(null, { statusCode: 404 });
      } else {
        callback(null, { statusCode: 500 });
      }
    })
);

const handle = (event, context, callback) => {
  if (event.path.startsWith("/badge")) {
    return process(getRedirect(event.pathParameters.owner,
                               event.pathParameters.repo,
                               event.queryStringParameters,
                               event.queryStringParameters.branch), callback);
  }

  if (event.path.startsWith("/results")) {
    return process(getLatestRunURL(event.pathParameters.owner,
                                   event.pathParameters.repo,
                                   event.queryStringParameters.branch), callback);
  }

  callback(null, { statusCode: 404 });
};

module.exports = { handle };
