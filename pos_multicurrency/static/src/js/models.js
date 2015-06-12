function openerp_pos_models_custom(instance, module){ //module is instance.point_of_sale
    var QWeb = instance.web.qweb;
	var _t = instance.web._t;

    var round_di = instance.web.round_decimals;
    var round_pr = instance.web.round_precision

    module.PosModel = module.PosModel.extend({
        initialize: function(session, attributes) {
            module.PosModel.__super__.initialize.apply(this, arguments);
            this.pos_multicurrency_data = [];
        },

        // loads all the needed data on the sever. returns a deferred indicating when all the data has loaded. 
        load_server_data: function(){
            this.models.push({
                label: 'currencies',
                loaded: function(self){
                    var currenciey_loaded = new $.Deferred();
                    model = new instance.web.Model("pos_multicurrency.currencies");
                    model.call('getAdditionalCurrencies', []).then(function(records){
                        self.pos_multicurrency_data = records;
                        currenciey_loaded.resolve();
                    });
                    return currenciey_loaded;
                },
            });
            return module.PosModel.__super__.load_server_data.apply(this, arguments);
        },
    });
   
    module.Order = module.Order.extend({
       
        export_for_printing: function(){
            var json = module.Order.__super__.export_for_printing.apply(this, arguments);

            var dueTotal = json.total_with_tax;
            var otherCurrencies = [];
            this.pos.pos_multicurrency_data.forEach(function(currency){
                otherCurrencies.push({
                    'label': currency.ticket_label,
                    'amount': round_pr(dueTotal * currency.rate, currency.rounding)
                });
            });
            json.otherCurrencies = otherCurrencies;

            return json;
        },
    });

}
