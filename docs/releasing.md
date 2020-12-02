# Releasing

Instead of doing [`npm publish`](https://docs.npmjs.com/cli/v6/commands/npm-publish) to do a new release, we use [release-it](https://github.com/release-it/release-it) to perform releases (refer to release-it's readme for benefits).

Releases are done manually using the `yarn release` command:

- Be sure to set up a `GITHUB_TOKEN` first (as it is required to publish release notes, refer to [release-it GitHub Releases documentation](https://github.com/release-it/release-it/blob/master/docs/github-releases.md))
- The release documentation and versioning is generated based on the commit messages (as per the [contributing guidelines](../CONTRIBUTING.md)).
- The versioning can be overridden to be manually specified (e.g. `yarn release minor`).

Troubleshooting:

- If you have two factor authentication enabled, there is a good chance that you won't be able to release successfully as the ping will cause you to enter a one time password, and then the actual publish will try and reuse it but fail. To get around this, do `yarn release --npm.skipChecks=true`
