const https = require("https");

const getCheckSuites = (owner, repo) => new Promise((resolve, reject) => {
  const req = {
    hostname: "api.github.com",
    port: 443,
    path: `/repos/${owner}/${repo}/commits/master/check-suites`,
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
        resolve(parsed.check_suites);
      } else {
        reject(parsed);
      }
    });
  });
});

const getStatus = checkSuites => {
  const matched = checkSuites.find(checkSuite => checkSuite.app.name === "GitHub Actions");
  if (!matched) {
    throw new Error("Could not find check suite named GitHub Actions");
  }

  return matched.conclusion;
};

const STATUS_COLORS = {
  error: "red",
  failure: "lightgrey",
  pending: "yellow",
  success: "green",
  no_runs: "lightgrey"
};

const getRedirectURL = status => {
  const normal = status || "no_runs";

  const base = "https://img.shields.io/badge/GitHub_Actions";
  const query = "?logo=github&logoColor=white";

  return `${base}-${normal}-${STATUS_COLORS[normal]}.svg${query}`;
};

const getRedirect = (owner, repo) => (
  getCheckSuites(owner, repo).then(getStatus).then(getRedirectURL)
);

module.exports = getRedirect;
