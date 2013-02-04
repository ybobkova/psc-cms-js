define(['joose', 'Psc/Code'], function(Joose) {
  Joose.Class('Psc.Loader', {
    
    has: {
      jobs: { is : 'rw', required: false, isPrivate: true, init: Joose.I.Array },
      dependencies: { is : 'rw', required: false, isPrivate: true, init: Joose.I.Array }
    },
  
    methods: {
      /**
       * Runs all current registered jobs
       *
       * after all jobs are run the promise is resolved (loader, int jobsStarted)
       * when one job fails the promoise is rejected, but all other jobs are executed (loader, [] jobErrors, int jobsSkipped, int jobsStarted)
       *
       * notice: jobsSkipped is not the status of the job itself, its just the status "if the job could no be started".
       * @return promise
       */
      finished: function () {
        // run all jobs for the current ones
        var that = this, d = $.Deferred(), job, jobs = this.$$jobs, jobsNum = jobs.length, jobsStarted = 0, jobsSkipped = 0, jobErrors = [];
        
        Psc.Code.group('Loader');
        Psc.Code.info('scheduling '+jobsNum+' Jobs');

        var complete = function () {
          if (jobsStarted+jobsSkipped >= jobsNum) { // all jobs have failed or are done
            Psc.Code.info('finished scheduling '+jobsNum+' Jobs. ('+jobsStarted+' scheduled, '+jobsSkipped+' skipped)');
            Psc.Code.endGroup('Loader');
            if (jobsSkipped > 0) {
              d.reject(that, jobErrors, jobsSkipped, jobsStarted);
            } else {
              d.resolve(that, jobsStarted);
            }
          }
        };
        
        // short track
        if (jobsNum === 0) {
          // first return promise, than resolve, it (this makes this function always return a promise
          // (allthough it would be still compatible with $.when()))
          setTimeout(function () {
            complete();
          }, 10);
          
          return d.promise();
        }
        
        var jobDone = function () {
          jobsStarted++;
          
          return complete();
        };

        var jobSkip = function (err, jobNum, jobFunc) {
          jobsSkipped++;
          
          err.jobNum = jobNum;
          err.jobFunc = jobFunc;
          
          if (d.state() === 'pending') {
            jobErrors.push(err);
            
            return complete();
          } else {
            throw err;
          }
        };
        
        var jobTracker = function (jobFunc, i) {
          return function () {
            try {
              jobFunc.apply(this, arguments);
                
              jobDone();
            } catch (err) {
              jobSkip(err, i, jobFunc);
            }
          };
        };
        
        for (var i = 0; i<jobsNum; i++) {
          job = jobs[i];
            
          // execute
          // i'd like to use a require(job[0], job[1]) here, allthough all dependencies in job[0] are already loaded
          // but that would not allow to catch the errors job could cause
                
          // a faster approach would be to map the requirements to the job and call directly
          // but this is a lot of array-fiddling
          
          require(job[0], jobTracker(job[1], i));
        }
        
        this.$$jobs = []; // clear for the next/new queue
        
        return d.promise();
      },
      /**
       * Fügt einen neuen Job in die Queue ein
       *
       */
      onReady: function (dependencies, job) {
        throw "onReady is deprecated";
      },

      /**
       * Registers a new job in the queue with its requirements
       *
       */
      onRequire: function (requirements, job) {
        Psc.Code.info('adding to jobs ', job);
        this.$$jobs.push([requirements, job]);
        this.$$dependencies = this.$$dependencies.concat(requirements);
        return this;
      },
      
      hasJobs: function () {
        return this.$$jobs.length > 0;
      },
      toString: function() {
        return "[Psc.Loader]";
      }
    }
  });
});