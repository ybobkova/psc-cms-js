define(['jquery'], function (jQuery) {
  (function($){
    $.ui.plugin.add("draggable", "connectMorphSortable", {
        start: function(event, ui) {
    
            var inst = $(this).data("draggable"), o = inst.options,
                uiSortable = $.extend({}, ui, { item: inst.element });
            inst.sortables = [];

            var $sortables;
            if ($.isFunction(o.connectMorphSortable)) {
                $sortables = (o.connectMorphSortable)();
            } else {
                $sortables = $(o.connectMorphSortable);
            }
            console.log($sortables);

            $sortables.each(function() {
                var sortable = $.data(this, 'sortable');
                if (sortable && !sortable.options.disabled) {
                    inst.sortables.push({
                        instance: sortable,
                        shouldRevert: sortable.options.revert
                    });
                    sortable.refreshPositions();	// Call the sortable's refreshPositions at drag start to refresh the containerCache since the sortable container cache is used in drag and needs to be up to date (this will ensure it's initialised as well as being kept in step with any changes that might have happened on the page).
                    sortable._trigger("activate", event, uiSortable);
                }
            });
    
        },
        stop: function(event, ui) {
    
            //If we are still over the sortable, we fake the stop event of the sortable, but also remove helper
            var inst = $(this).data("draggable"),
                uiSortable = $.extend({}, ui, { item: inst.element });

            $.each(inst.sortables, function() {
                if(this.instance.isOver) {
    
                    this.instance.isOver = 0;
    
                    inst.cancelHelperRemoval = true; //Don't remove the helper in the draggable instance
                    this.instance.cancelHelperRemoval = false; //Remove it in the sortable instance (so sortable plugins like revert still work)
    
                    //The sortable revert is supported, and we have to set a temporary dropped variable on the draggable to support revert: 'valid/invalid'
                    if(this.shouldRevert) this.instance.options.revert = true;
    
                    //Trigger the stop of the sortable
                    this.instance._mouseStop(event);
    
                    this.instance.options.helper = this.instance.options._helper;
    
                    //If the helper has been the original item, restore properties in the sortable
                    if(inst.options.helper == 'original')
                        this.instance.currentItem.css({ top: 'auto', left: 'auto' });

                    this.instance._trigger('morphStop', event, this.instance.currentItem);
                } else {
                    this.instance.cancelHelperRemoval = false; //Remove the helper in the sortable instance
                    this.instance._trigger("deactivate", event, uiSortable);
                }
    
            });
    
        },
        drag: function(event, ui) {
    
            var inst = $(this).data("draggable"), self = this;
    
            $.each(inst.sortables, function(i) {
                
                //Copy over some variables to allow calling the sortable's native _intersectsWith
                this.instance.positionAbs = inst.positionAbs;
                this.instance.helperProportions = inst.helperProportions;
                this.instance.offset.click = inst.offset.click;
                
                if(this.instance._intersectsWith(this.instance.containerCache)) {
    
                    //If it intersects, we use a little isOver variable and set it once, so our move-in stuff gets fired only once
                    if(!this.instance.isOver) {
    
                        this.instance.isOver = 1;
                        //Now we fake the start of dragging for the sortable instance,
                        //by cloning the list group item, appending it to the sortable and using it as inst.currentItem
                        //We can then fire the start event of the sortable with our passed browser event, and our own helper (so it doesn't create a new one)
                        this.instance.currentItem = inst.options.morph(inst)
                            .appendTo(this.instance.element).data("sortable-item", true);
                        this.instance.options._helper = this.instance.options.helper; //Store helper option to later restore it
                        this.instance.options.helper = function() { return ui.helper[0]; };
    
                        event.target = this.instance.currentItem[0];
                        this.instance._mouseCapture(event, true);
                        this.instance._mouseStart(event, true, true);
    
                        //Because the browser event is way off the new appended portlet, we modify a couple of variables to reflect the changes
                        this.instance.offset.click.top = inst.offset.click.top;
                        this.instance.offset.click.left = inst.offset.click.left;
                        this.instance.offset.parent.left -= inst.offset.parent.left - this.instance.offset.parent.left;
                        this.instance.offset.parent.top -= inst.offset.parent.top - this.instance.offset.parent.top;
    
                        inst._trigger("toSortable", event);
                        inst.dropped = this.instance.element; //draggable revert needs that
                        //hack so receive/update callbacks work (mostly)
                        inst.currentItem = inst.element;
                        this.instance.fromOutside = inst;
    
                    }
    
                    //Provided we did all the previous steps, we can fire the drag event of the sortable on every draggable drag, when it intersects with the sortable
                    if(this.instance.currentItem) this.instance._mouseDrag(event);
    
                } else {
    
                    //If it doesn't intersect with the sortable, and it intersected before,
                    //we fake the drag stop of the sortable, but make sure it doesn't remove the helper by using cancelHelperRemoval
                    if(this.instance.isOver) {
    
                        this.instance.isOver = 0;
                        this.instance.cancelHelperRemoval = true;
                        
                        //Prevent reverting on this forced stop
                        this.instance.options.revert = false;
                        
                        // The out event needs to be triggered independently
                        this.instance._trigger('out', event, this.instance._uiHash(this.instance));
                        
                        this.instance._mouseStop(event, true);
                        this.instance.options.helper = this.instance.options._helper;
    
                        //Now we remove our currentItem, the list group clone again, and the placeholder, and animate the helper back to it's original size
                        this.instance.currentItem.remove();
                        if(this.instance.placeholder) this.instance.placeholder.remove();
    
                        inst._trigger("fromSortable", event);
                        inst.dropped = false; //draggable revert needs that
                    }
                };
            });
        }
    });
  })(jQuery);
});