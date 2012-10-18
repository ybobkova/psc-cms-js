Joose.Class('Psc.CommentsService', {
  
  has: {
    // .handleAjaxRequest(request, ajaxHandler, bool handleDefaultFailure)
    ajaxService: { is : 'rw', required: true, isPrivate: true },
    
    /**
     * ein Psc.Request wird als vorlage benutzt
     */
    pullRequest: { is : 'rw', required: true, isPrivate: true }
  },
  
  methods: {
    pullComments: function () {
      var d = $.Deferred();
      
      var status = this.$$ajaxService.handleAjaxRequest(
        this.$$pullRequest.copy(),
        undefined,
        true // handleDefaultFailure
      );
      
      status.done(function (response) {
        d.resolve(response.getBody());
      });
      
      status.fail(function () {
        d.reject();
      });

      return d.promise();
/*
      return [
        {
          id: 18,
          name: 'Philipp S',
          email: 'me@ps-webforge.com',
          content: "Ich glaube, \n\ndass dies auch ein mal ein schöner Kommentar.\n\nZum umbrechen\noder ähnlcihem ist",
          cdate: {
            'date':"1347432972",
            'timezone':"Europe/Berlin"
          }
        }];
*/
    },
    
    toString: function() {
      return "[Psc.CommentsService]";
    }
  }
});