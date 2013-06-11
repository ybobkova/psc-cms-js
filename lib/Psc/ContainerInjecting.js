define(['jquery', 'joose', 'translator', 'Psc/Container', 'Psc/CMS/NavigationService'], function ($, Joose, translator) {
  Joose.Class('Psc.ContainerInjecting', {

    has: {
      container: { is: 'rw', required: false, isPrivate: true}
    },
    
    before: {
      initialize: function (props) {
        if (!props.container) {
          this.$$container = new Psc.Container({
            translator: translator,

            navigationService: new Psc.CMS.NavigationService({
              flat: [] // this is of course bullshit, but i have no other idea to create a default?
            })
          });
        }
      }
    }
  });
});