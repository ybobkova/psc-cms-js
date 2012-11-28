define(['psc-tests-assert', '<%= className.replace(/\./g, '/') %>'], function(t) {
  
  module("<%= className %>");

  var setup = function (test) {
    //var dm = new Psc.Test.DoublesManager();
    var <%= scClass %> = new <%= className %>({
    });
    
    return t.setup(test, {<%= scClass %>: <%= scClass %>});
  };
  
  test("", function() {
    var that = setup(this);
  });
});