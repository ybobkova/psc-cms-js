define(['jquery', 'text!test-files/tabs-for-main.html', 'boot-helper', 'joose', 'Psc/UI/Main', 'Psc/UI/Tabs'], function ($, htmlTabs, boot, Joose) {
  
  return boot.createMain($('<div />').append(htmlTabs));

});