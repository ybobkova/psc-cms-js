define(['Psc/UI/Dialog'], function() {
  var dialog, constructSubmitted = false;
  
  module("Radios Test");

  test("radios work in IE", function() {
    var html = $('<div class="radios-wrapper psc-guid-radios-wrapper-for-38db7ac4aa11f6f6f40c727e363c82a6 ui-buttonset" id="radios-wrapper-for-38db7ac4aa11f6f6f40c727e363c82a6">'+
      '<input type="radio" checked="checked" value="fx" name="type" id="38db7ac4aa11f6f6f40c727e363c82a6-1" class="ui-helper-hidden-accessible"> <label for="38db7ac4aa11f6f6f40c727e363c82a6-1" class="ui-state-active ui-button ui-widget ui-state-default ui-button-text-only ui-corner-left" aria-pressed="true" role="button" aria-disabled="false"><span class="ui-button-text">FX</span></label>'+
      '<input type="radio" value="text" name="type" id="38db7ac4aa11f6f6f40c727e363c82a6-2" class="ui-helper-hidden-accessible"> <label for="38db7ac4aa11f6f6f40c727e363c82a6-2" aria-pressed="false" class="ui-button ui-widget ui-state-default ui-button-text-only" role="button" aria-disabled="false"><span class="ui-button-text">Sprache</span></label>'+
      '<input type="radio" value="song" name="type" id="38db7ac4aa11f6f6f40c727e363c82a6-3" class="ui-helper-hidden-accessible"> <label for="38db7ac4aa11f6f6f40c727e363c82a6-3" aria-pressed="false" class="ui-button ui-widget ui-state-default ui-button-text-only ui-corner-right" role="button" aria-disabled="false"><span class="ui-button-text">Lied</span></label>'+
    '</div>');
    
    html.buttonset({});
    
    var $form = $('<form></form>');
    $form.append(html);
    
    $form.append($('<button>test</button>').button({text:"test"}).click(function (e) {
      e.preventDefault();
      console.log($form.formSerialize());
    }));
    
    $('#visible-fixture').append($form);
    
  });
});