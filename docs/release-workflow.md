# Release the library

A small sketch of the full testing/integration workflow

## releases

When I want to release a new version it might be a specific type of version:

  - a major/minor release
  - a patch
  - a build

A build-release is like a normal push to a composer repository on a dev branch. It creates a new build with the git reference. This will be published non-stable to npm
A major or minor release is something very well defined and should seperate dev builds from real releases. Those releases need to be correctly tagged in git repository and will be published stable to npm.
A patch is something in between the two. It is something that is tested (and acceptance tested, yet) and can be released as a bugfix for a stable version.

## prerequirements

  - A (major/minor/patch/build) release will only ever published to npm if the continuation server can successful build and test.
  - git tags from the sourcecode repository are only for major/minor/patch builds

## conclusions  

The prerequirements require that the npm publish command is only issued by the continuation integration server (travis-ci) in the after_success hook.
A git-tag in the sourcecode repository will only be created when a build has already passed. The build cannot be tagged before travis-ci has run.

## use cases

We have developed something where we are 90% sure that the builds will pass on travis. We want to push it to the source code repository to let the continuous integration server test it. 
Because we are 90% sure we can tag this release as a build and it will be published to npm as dev (with a --tag option to publish). Giving us the opportunity to install it from other projects with dependency@dev. Thats cool, but If we bump the version in git we would have a "Release x.x.x-1-9xbef9" in the commit log. But maybe Travis will fail to build and will not release to npm: having a "bad" Version commited in the package.json.

We have pushed our dev build and everything is working fine. We want to release it as a patch making it "stable" to other (maybe untested for acceptance) projects, so that they will automatically update. 
We would release a new patch version. Actually we don't want to run travis-ci not again (because we already now, that is passing). But we have to bump package.json creating a new commit on the git source code repo, which triggers travis.


## solution 

So this is my solution right now:

Publish a dev-build:
  1. push to the repo without bumping the version in the package.json of the source-code repository
  2. travis is checking the whole build
  3. if the build is not successful nothing will be happen further
  4. copy the package.json to the build directory and bump its version to a dev release
  5. publish the build folder as dev-tagged version to npm

  - We can acceptance test the dev build using require dependency@dev in the package.json of subprojects.
  - the repository is not modified if the push will fail
  - nothing is released on error

Publish a major/minor/patch:
  
  1. bump the version in package.json of the sourcecode repository
  2. commit the bump
  3. create a tag with the bumped version
  4. push the commit and the version to the sourcecode repository
  5. travis is checking the whole build
  6. the success is always successful
  7. copy the package.json unmodified to the build directory
  8. publish the build folder as latest version to npm
  9. (Deploy the build folder to an artifact repository)

Notice: We cannot do `npm tag dependency@dev latest` to publish the build folder as the latest version. Because the package.json would then be still having the dev build.

Disadvantages:
  - the build is checked twice from travis (with the same contents) only the package.json and maybe the changelog would be changed on publishing a major/minor/patch.
  - copying the package.json seems to be hacky
  - the travis ci has to check if the release is a major/minor/patch otherwise release a dev build.
