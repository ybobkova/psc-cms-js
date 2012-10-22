define(['Psc/CMS/Deleteable', 'Psc/CMS/Buttonable'], function () {
  Joose.Role('Psc.CMS.DeleteButtonable', {
    
    does: [Psc.CMS.Deleteable, Psc.CMS.Buttonable],
    
    methods: {
      // aka: getDeleteButton?
    }
  });
});