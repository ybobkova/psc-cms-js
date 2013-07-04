define(['jquery', 'joose', 'knockout', 'jqwidgets', 'joose', 'Psc/TableModel'], function ($, Joose, ko) {
  Joose.Class('Psc.ko.Table', {
    isa: Psc.TableModel,

    has: {
      data: { is : 'rw', required: false, isPrivate: true },
      jqxDataAdapter: { is : 'rw', required: false, isPrivate: true }
    },
    
    after: {
      initialize: function (props) {
        this.$$data = ko.observableArray(props.rows || []);
      }
    },
    
    methods: {
      jqxDataAdapter: function () {
        if (!this.$$jqxDataAdapter) {
          this.$$jqxDataAdapter = new $.jqx.dataAdapter({
            localdata: this.getData(),
            datatype: 'observablearray'
          });
        }
        
        return this.$$jqxDataAdapter;
      },
    
      toString: function () {
        return '[Psc.ko.Table]';
      }
    }
  });
});