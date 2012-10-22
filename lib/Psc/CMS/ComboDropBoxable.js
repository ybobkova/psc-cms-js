define(['Psc/CMS/SelectComboBoxable', 'Psc/CMS/DropBoxButtonable', 'Psc/UI/DropBoxButton'], function () {
  Joose.Role('Psc.CMS.ComboDropBoxable', {
    
    does: [Psc.CMS.SelectComboBoxable, Psc.CMS.DropBoxButtonable, Psc.UI.DropBoxButton]
  
  });
});  