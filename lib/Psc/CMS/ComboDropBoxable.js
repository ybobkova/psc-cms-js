define(['joose', 'Psc/CMS/SelectComboBoxable', 'Psc/CMS/DropBoxButtonable', 'Psc/UI/DropBoxButton'], function (Joose) {
  Joose.Role('Psc.CMS.ComboDropBoxable', {
    
    does: [Psc.CMS.SelectComboBoxable, Psc.CMS.DropBoxButtonable, Psc.UI.DropBoxButton]
  
  });
});  