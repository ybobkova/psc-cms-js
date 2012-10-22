define(['psc-tests-assert','Psc/CMS/Service','Psc/Request'], function() {
  
  module("Psc.CMS.Service", {
    setup: function () {
      
    }
  });

  test("acceptance", function() {
    var service = new Psc.CMS.Service({ });
    
    return 'redirects';
    
    service.download(new Psc.Request({
      url: '/some/post/url',
      method: 'POST',
      body: {
        some: 'post',
        data:'avaible'
      }
    }));
  
  });
});