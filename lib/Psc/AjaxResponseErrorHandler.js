define(['Psc/UI/ErrorPane', 'Psc/ResponseMetaReader'], function() {
  Joose.Class('Psc.AjaxResponseErrorHandler', {
    
    /**
     * Fügt einem container den error pane hinzu
     *
     * mit display() kann dieser dann in $container angzeigt werden (wird davor gehängt mit prepend());
     */
    appendErrorPaneFromResponse: function ($container, response) {
      return new Psc.UI.ErrorPane({
        label: label,
        container: $form,
        errorMessage: response.getBody()
      });
    }
  });
});
