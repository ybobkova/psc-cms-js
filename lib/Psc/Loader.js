define(['Psc/Code'], function() {
  Joose.Class('Psc.Loader', {
    
    has: {
      deferred: { is : 'rw', required: false, isPrivate: true },
      jobs: { is : 'rw', required: false, isPrivate: true, init: Joose.I.Array },
      dependencies: { is : 'rw', required: false, isPrivate: true, init: Joose.I.Array }
    },
  
    methods: {
      /**
       * Verarbeitet alle Jobs in der Queue und meldet when ready
       *
       * @return promise
       */
      finished: function () {
        var that = this, d, x = 1, job, jobs = this.$$jobs;
        
        // der job processor läuft gerade
        if (this.$$deferred) {
          return this.$$deferred.promise();
        } else {
          // job processor starten
          d = this.$$deferred = $.Deferred();
  
          use(this.$$dependencies, function() { // das ist asynchron
            try {
              while (jobs.length && x <= 500) {
                job = jobs.shift();
            
                // execute
                //Psc.Code.debug('Starte Job '+x);
                job();
                x++;
              }
            } catch (e) {
              d.reject(e);
              that.setDeferred(undefined);
              
              return;
            }
          
            d.resolve(that);
            that.setDeferred(undefined);
          });
          
          return d.promise();
        }
      },
      /**
       * Fügt einen neuen Job in die Queue ein
       *
       */
      onReady: function (dependencies, job) {
        this.$$jobs.push(job);
        this.$$dependencies = this.$$dependencies.concat(dependencies);
        // man könnte sich hier überlegen für jeden job ein deferred zu erstellen und hie rdas promise zurückzugeben
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