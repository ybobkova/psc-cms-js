define(['jquery', 'jquery-ui'], function (jQuery) {
  
  /*! jQuery UI - v1.8.20 - 2012-04-30
  * https://github.com/jquery/jquery-ui
  * Copyright (c) 2012 AUTHORS.txt; Licensed MIT, GPL */
  
  /* German initialisation for the jQuery UI date picker plugin. */
  /* Written by Milian Wolff (mail@milianw.de). */
    $.datepicker.regional['de'] = {
      closeText: 'schließen',
      prevText: '&#x3c;zurück',
      nextText: 'Vor&#x3e;',
      currentText: 'heute',
      monthNames: ['Januar','Februar','März','April','Mai','Juni',
      'Juli','August','September','Oktober','November','Dezember'],
      monthNamesShort: ['Jan','Feb','Mär','Apr','Mai','Jun',
      'Jul','Aug','Sep','Okt','Nov','Dez'],
      dayNames: ['Sonntag','Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag'],
      dayNamesShort: ['So','Mo','Di','Mi','Do','Fr','Sa'],
      dayNamesMin: ['So','Mo','Di','Mi','Do','Fr','Sa'],
      weekHeader: 'KW',
      dateFormat: 'dd.mm.yy',
      firstDay: 1,
      isRTL: false,
      showMonthAfterYear: false,
      yearSuffix: ''};
  
  /* French initialisation for the jQuery UI date picker plugin. */
  /* Written by Keith Wood (kbwood{at}iinet.com.au),
                Stéphane Nahmani (sholby@sholby.net),
                Stéphane Raimbault <stephane.raimbault@gmail.com> */
    $.datepicker.regional['fr'] = {
      closeText: 'Fermer',
      prevText: 'Précédent',
      nextText: 'Suivant',
      currentText: 'Aujourd\'hui',
      monthNames: ['Janvier','Février','Mars','Avril','Mai','Juin',
      'Juillet','Août','Septembre','Octobre','Novembre','Décembre'],
      monthNamesShort: ['Janv.','Févr.','Mars','Avril','Mai','Juin',
      'Juil.','Août','Sept.','Oct.','Nov.','Déc.'],
      dayNames: ['Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi'],
      dayNamesShort: ['Dim.','Lun.','Mar.','Mer.','Jeu.','Ven.','Sam.'],
      dayNamesMin: ['D','L','M','M','J','V','S'],
      weekHeader: 'Sem.',
      dateFormat: 'dd/mm/yy',
      firstDay: 1,
      isRTL: false,
      showMonthAfterYear: false,
      yearSuffix: ''};
});