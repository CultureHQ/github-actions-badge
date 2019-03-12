const https = require("https");

const makeRequest = path => new Promise((resolve, reject) => {
  const req = {
    hostname: "api.github.com",
    port: 443,
    path,
    method: "GET",
    headers: {
      Accept: "application/vnd.github.antiope-preview+json",
      "User-Agent": "node"
    }
  };

  https.get(req, resp => {
    let data = "";

    resp.on("data", chunk => { data += chunk; });
    resp.on("error", error => reject(error));
    resp.on("end", () => {
      const parsed = JSON.parse(data);

      if (resp.statusCode === 200) {
        resolve(parsed);
      } else {
        reject(parsed);
      }
    });
  });
});

const findCheckSuite = parsed => {
  const matched = parsed.check_suites.find(checkSuite => (
    checkSuite.app.name === "GitHub Actions"
  ));

  if (!matched) {
    throw new Error("Could not find check suite named GitHub Actions");
  }

  return matched;
};

const getCheckSuite = (owner, repo) => (
  makeRequest(`/repos/${owner}/${repo}/commits/master/check-suites`).then(findCheckSuite)
);

const getLatestRunURL = (owner, repo) => (
  getCheckSuite(owner, repo)
    .then(checkSuite => makeRequest(checkSuite.check_runs_url))
    .then(response => ({
      url: response.check_runs[0].html_url,
      etag: response.check_runs[0].head_sha
    }))
);

module.exports = {
  getCheckSuite,
  getLatestRunURL
};
