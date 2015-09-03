function openerp_pos_widgets_custom(instance, module){ //module is instance.point_of_sale

    module.ActionBarWidget = module.ActionBarWidget.extend({

        set_button_disabled: function(name, disabled){
            this._super(name, disabled);
            if(name == 'validation'){
                this._super('validation_no_ticket', disabled);
            }
        },

    });

}
