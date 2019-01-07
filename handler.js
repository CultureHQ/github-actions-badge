const getRedirect = require("./getRedirect");

const handle = (event, context, callback) => (
  getRedirect(event.pathParameters.owner, event.pathParameters.repo, event.queryStringParameters)
    .then(redirect => callback(null, {
      statusCode: 303,
      headers: {
        "Cache-Control": "no-cache",
        Location: redirect
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

module.exports = { handle };
