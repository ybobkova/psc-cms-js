/*
 * this bootstrap is a fake bootstrap for tests, which creates a main with fixture contents
 */
define(['jquery','joose','Psc/UI/Main','Psc/UI/Tabs'], function ($) {
  
  var $cmsContent = $('<div />').append('<div class="psc-cms-ui-tabs" />');
  
  var $tabs = $cmsContent.find('div.psc-cms-ui-tabs:eq(0)'); // das erste tabs objekt wird unser main tab
  var main = new Psc.UI.Main({
    tabs: new Psc.UI.Tabs({
      widget: $tabs
    })
  });
  
  main.attachHandlers();
  main.getEventManager().setLogging(true);
  
  return main;
});