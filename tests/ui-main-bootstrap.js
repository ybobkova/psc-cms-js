/*
 * this bootstrap is a fake bootstrap for tests, which creates a main with fixture contents
 */
define(['jquery', 'text!fixtures/tabs-for-main.html', 'joose', 'Psc/UI/Main', 'Psc/UI/Tabs'], function ($, htmlTabs) {
  var $cmsContent = $('<div />').append(htmlTabs);
  
  var $tabs = $cmsContent.find('div.psc-cms-ui-tabs:eq(0)'); // das erste tabs objekt wird unser main tab
  var main = new Psc.UI.Main({
    tabs: new Psc.UI.Tabs({
      widget: $tabs
    })
  });
  
  main.attachHandlers();
  main.getEventManager().setLogging(true);
  
  window.requireLoad = function(requirements, payload) {
    requirements.unshift('js/main');
    main.getLoader().onRequire(requirements, payload);
  };
  
  return main;
});