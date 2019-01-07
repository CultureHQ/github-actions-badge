# github-actions-badge

This is a small AWS lambda that renders a README badge based on the status of your Github Actions workflow. You can add the badge to your README by including:

```
![Actions Status](https://wdp9fww0r9.execute-api.us-west-2.amazonaws.com/production/badge/{owner}/{repo})
```

where `{owner}` and `{repo}` are replaced by the github username and the repository name, respectively. For example, this repository would use:

```
https://wdp9fww0r9.execute-api.us-west-2.amazonaws.com/production/badge/CultureHQ/github-actions-badge
```

The badge variants look like:

* ![Error](https://img.shields.io/badge/GitHub_Actions-error-red.svg?logo=github&logoColor=white)
* ![Failure](https://img.shields.io/badge/GitHub_Actions-failure-lightgrey.svg?logo=github&logoColor=white)
* ![Pending](https://img.shields.io/badge/GitHub_Actions-pending-yellow.svg?logo=github&logoColor=white)
* ![Success](https://img.shields.io/badge/GitHub_Actions-success-green.svg?logo=github&logoColor=white)
* ![No Runs](https://img.shields.io/badge/GitHub_Actions-no_runs-lightgrey.svg?logo=github&logoColor=white)

## Options

You can pass additional options to the badge through the image URL that will be forwarded on to [shields.io](https://shields.io/#/) (the source for the images). The options are documented on their page.

For instance, if you wanted to change the style to `flat-square`, you could pass it as a query param as in:

```
![Actions Status](https://wdp9fww0r9.execute-api.us-west-2.amazonaws.com/production/badge/{owner}/{repo}?style=flat-square)
```

## Development

To develop locally, install dependencies with `yarn`. Then you can run `yarn start` at the root of the repository to start a local server.
