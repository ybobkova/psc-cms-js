define(['jquery', 'joose', 'Psc/Container', 'Psc/CMS/NavigationService'], function ($, Joose) {
  Joose.Class('Psc.ContainerInjecting', {

    has: {
      container: { is: 'rw', required: false, isPrivate: true}
    },
    
    before: {
      initialize: function (props) {
        if (!props.container) {
          this.$$container = new Psc.Container({
            navigationService: new Psc.CMS.NavigationService({
              flat: [] // this is of course bullshit, but i have no other idea to create a default?
            })
          });
        }
      }
    }
  });
});