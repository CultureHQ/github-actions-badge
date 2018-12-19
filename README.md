# github-actions-badge

This is a small AWS lambda that renders a README badge based on the status of your Github Actions workflow. You can add the badge to your README by including:

```
![Actions Status](https://wdp9fww0r9.execute-api.us-west-2.amazonaws.com/production/badge/{owner}/{repo})
```

where `{owner}` and `{repo}` are replaced by the github username and the repository name, respectively. For example, this repository would use: `https://wdp9fww0r9.execute-api.us-west-2.amazonaws.com/production/badge/CultureHQ/github-actions-badge`.

## Development

To develop locally, install dependencies with `yarn`. Then you can run `yarn start` at the root of the repository to start a local server.
