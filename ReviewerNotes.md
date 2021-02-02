## Reviewer notes and build instructions

This extension is configured to use **npm** packages and be built with **grunt**.

There are 3 grunt group tasks defined:

#### review

To be used for the review process. A duplicate of the release task with the exception of running the PowerShell script that creates the release packages. Runs:

`grunt clean:release`<br />
`grunt sass`<br />
`grunt copy:release`<br />
`grunt uglify`<br />
`grunt cssmin`

#### release

Builds the `dist/` directory and runs a PowerShell script which the runs web-ext to create the release packages. Runs:

`grunt clean:release`<br />
`grunt sass`<br />
`grunt copy:release`<br />
`grunt uglify`<br />
`grunt cssmin`<br />
`grunt shell:ps`

#### debug

Used for local development. Ignore for review process. Runs:

`grunt jshint`<br />
`grunt clean:debug`<br />
`grunt sass`<br />
`grunt copy`<br />
`grunt cssmin`

### Process to duplicate release package files

To build from the source-review-x.x.x.x.zip package

- Extract the archive
- Navigate to the extracted directory 
- Run `npm i`
- Run `grunt review`

The files in the created `dist/` directory can be used for review against the deployed package.
