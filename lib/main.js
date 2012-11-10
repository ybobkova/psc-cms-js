define(['jquery', 'text!fixtures/tabs-for-main.html', 'boot-helper', 'joose', 'Psc/UI/Main', 'Psc/UI/Tabs'], function ($, htmlTabs, boot) {
  
  return boot.createMain($('<div />').append(htmlTabs));

});