/**
 * Handle payloads received from Github and
 * launch the corresponding build if necessary
 */

var app = require('../app')
  , Job = require('../lib/job')
  ;


module.exports = function (req, res, next) {
  var jobsMetadata = app.getJobsMetadata()
    , jobs = Object.keys(jobsMetadata)
    , payload = JSON.parse(req.body.payload)
    , receivedGithubRepoUrl = payload.repository.url
    , receivedBranch = payload
    , jobToBuild;

  jobs.forEach(function (name) {
    if (jobsMetadata[name].githubRepoUrl === receivedGithubRepoUrl) {
      jobToBuild = name;
    }
  });

  if (jobToBuild) {
    Job.getJob(jobToBuild, function (err, job) {
      if (err) { return res.send(200); }
      job.build(null, function (err) {
        res.send(200);
      });
    });
  }
};