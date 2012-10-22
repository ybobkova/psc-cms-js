define(['ui-paging', 'Psc/UI/WidgetWrapper'], function() {
  Joose.Class('CoMun.SearchWidget', {
    isa: Psc.UI.WidgetWrapper,
  
    has: {
      pagingOptions: { is : 'rw', required: false, isPrivate: true, init: Joose.I.Object },
      // $paging cache (jQuery element mit psc-paging-widget)
      paging: { is : 'rw', required: false, isPrivate: true },
      
      // der initiale / aktuelle suchterm
      term: { is : 'rw', required: true, isPrivate: true },
      page: { is : 'rw', required: false, isPrivate: true },
      
      // das template für die darstellung eines results
      resultTemplate: { is : 'rw', required: true, isPrivate: true },
      
      /**
       * .searchTerm(term, page) returns: results[] (.headline .excerpt, .id, .url)
       */
      service: { is : 'rw', required: true, isPrivate: true }
    },
    
    after: {
      initialize: function () {
        this.linkWidget();
        this.initForm();
        
        var page = Math.max(1, this.$$page);
        this.$$pagingOptions.currentPage = page; // da ui.paging so mist ist müssen wir es mit der richtigen seite (von GET) setzen
        this.search(this.$$term, page);
      }
    },
    
    methods: {
      initForm: function () {
        var that = this;
        this.unwrap().find('.form-post-search').on('submit', function(e) {
          e.preventDefault();
          var term = $(this).find('input[name="term"]').val();
          
          if (term) {
            that.search(term, 1); // hier immer seite 1, weil neue suche
          }
          
        });
  
        this.$$pagingOptions.pageURL = function (pageNum, paging) {
          return '?term='+that.getTerm()+'&page='+pageNum;
        };
        
        /*
         * weil das ui.paging echt uncool das html refreshed, laden wird ie seite neu
        this.findPaging().on('click', 'a', function (e) {
          e.preventDefault();
          var pageNum = parseInt($(e.target).attr('rel'), 10);
          if (pageNum) {
            that.search(that.getTerm(), pageNum);
          }
        });
        */
      },
      search: function (term, newPage) {
        var that = this;
        
        if (term) {
          this.$$term = term;
          this.unwrap().find('.loading').show();
          
          $.when(this.$$service.searchTerm(term, newPage)).then(function (pagingResult) {
            that.refreshResults(pagingResult.results);
            that.refreshPaging(pagingResult.pages, pagingResult.page); // pagingResult.page muss nicht zwingend newPage sein (wenns der UI vergimbelt hat)
          });
        }
      },
      refreshPaging: function (allPages, newPage) {
        var $paging = this.findPaging(); // das immer machen, damit auch init ausgeführt wird
        
        $paging.paging('pages', allPages);
        
        if (newPage) {
          this.$$page = newPage;
          $paging.paging('page', newPage);
        }
      },
      refreshResults: function(results) {
        var $widget = this.unwrap(), $loading = $widget.find('.loading');
        
        $loading.hide();
        
        // alle vorherigen results entfernen
        $widget.find('article.post').remove();
        
        // was tun wir bei 0 results?
        var key, result, $result;
        for (key in results) {
          result = results[key];
          $result = this.$$resultTemplate.render(result);
          
          $loading.after($result);
        }
      },
      // macht find + init für das paging
      findPaging: function () {
        if (!this.$$paging) {
          this.$$paging = this.unwrap().find('footer.paging ul');
          
          // init psc ui paging
          this.$$paging.paging(this.$$pagingOptions);
        }
        
        return this.$$paging;
      },
      toString: function() {
        return "[CoMun.SearchWidget]";
      }
    }
  });
});