define(['Psc/Test/DoublesManager'], function () {

  var dm = new Psc.Test.DoublesManager();

  return {
    dm: dm,
    container: dm.getContainer()
  };

});