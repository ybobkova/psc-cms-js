define(['Psc/CMS/Buttonable','Psc/CMS/TabOpenable'], function() {
  Joose.Role('Psc.CMS.TabButtonable', {
    
    does: [Psc.CMS.Buttonable, Psc.CMS.TabOpenable]
  
  });
});