const crypto = require("crypto");
const { getCheckSuite } = require("./githubClient");

const OPTIONS = [
  "style", "logo", "label", "logoColor", "logoWidth", "link", "colorA",
  "colorB", "maxAge", "cacheSeconds"
];

const getQueryParams = options => OPTIONS.reduce((accum, key) => {
  const normal = options[key] || accum[key] || null;

  if (normal) {
    return { ...accum, [key]: normal };
  }
  return accum;
}, { logo: "github", logoColor: "white" });

const getQuery = options => {
  const params = getQueryParams(options);

  return Object.keys(params).reduce((accum, key, index) => (
    `${accum}${index === 0 ? "?" : "&"}${key}=${params[key]}`
  ), "");
};

const STATUS_COLORS = {
  error: "red",
  failure: "lightgrey",
  pending: "yellow",
  success: "green",
  no_runs: "lightgrey"
};

const makeRedirect = options => checkSuite => {
  const base = "https://img.shields.io/badge/GitHub_Actions";
  const normal = checkSuite.conclusion || "no_runs";
  const query = getQuery(options);

  const hash = crypto.createHash("md5");
  hash.update(normal);
  hash.update(query);

  return {
    url: `${base}-${normal}-${STATUS_COLORS[normal]}.svg${query}`,
    etag: `"${hash.digest("hex")}"`
  };
};

const getRedirect = (owner, repo, options) => (
  getCheckSuite(owner, repo).then(makeRedirect(options || {}))
);

module.exports = getRedirect;
