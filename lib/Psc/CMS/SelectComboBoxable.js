define(['joose', 'Psc/CMS/AutoCompletable'], function (Joose) {
  Joose.Role('Psc.CMS.SelectComboBoxable', {
    
    does: [Psc.CMS.AutoCompletable]
    
  });
});