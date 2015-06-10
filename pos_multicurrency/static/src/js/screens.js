function openerp_pos_screens_custom(instance, module){ //module is instance.point_of_sale
    var QWeb = instance.web.qweb,
    _t = instance.web._t;

    var round_pr = instance.web.round_precision;
    var round_di = instance.web.round_decimals;

    var pos_multicurrency_data = [];
    var pos_multicurrency_is_loaded = false;
    var get_other_currencies = function(){
        var def = $.Deferred();
        if(pos_multicurrency_is_loaded){
            def.resolve(pos_multicurrency_data);
        }
        else{
            model = new instance.web.Model("pos_multicurrency.currencies");
            model.call('getAdditionalCurrencies', []).then(function(records){
                pos_multicurrency_data = records;
                pos_multicurrency_is_loaded = true;
                def.resolve(records);
            });
        }
        return def;
    }

    var pos_multic_format_currency = function(amount,currency){
            var decimals = 2;//currency.decimals;

            if (typeof amount === 'number') {
                amount = round_di(amount,decimals).toFixed(decimals);
            }

            if (currency.position === 'after') {
                return amount + ' ' + (currency.symbol || '');
            } else {
                return (currency.symbol || '') + ' ' + amount;
            }
        }

    module.PaymentScreenWidget = module.PaymentScreenWidget.extend({
        
        update_payment_summary: function() {
            var self = this;
            var def = get_other_currencies();
            def.then(function(data){
                var currentOrder = self.pos.get('selectedOrder');
                var paidTotal = currentOrder.getPaidTotal();
                var dueTotal = currentOrder.getTotalTaxIncluded();
                var remaining = dueTotal > paidTotal ? dueTotal - paidTotal : 0;
                var change = paidTotal > dueTotal ? paidTotal - dueTotal : 0;

                var otherLines = $('<div>').css({'font-size': '24px'});

                data.forEach(function(currency){
                    var amount = dueTotal * currency.rate;
                    var display = pos_multic_format_currency(amount, currency);
                    otherLines.append($('<div>').text(display));
                });

                var due_total = $('<div>');
                due_total.append($('<div>').html(self.format_currency(dueTotal)));
                due_total.append(otherLines);

                self.$('.payment-due-total').html(due_total);
                self.$('.payment-paid-total').html(self.format_currency(paidTotal));
                self.$('.payment-remaining').html(self.format_currency(remaining));
                self.$('.payment-change').html(self.format_currency(change));
                if(currentOrder.selected_orderline === undefined){
                    remaining = 1;  // What is this ? 
                }
                    
                if(self.pos_widget.action_bar){
                    self.pos_widget.action_bar.set_button_disabled('validation', !self.is_paid());
                    self.pos_widget.action_bar.set_button_disabled('invoice', !self.is_paid());
                }
            });


            
        },
    });


    module.ReceiptScreenWidget = module.ReceiptScreenWidget.extend({


        refresh: function() {
            this._super.apply(this, arguments);
            var self = this;

            var def = get_other_currencies();
            def.then(function(data){

                var order = self.pos.get('selectedOrder');
                var total = order.getTotalTaxIncluded();

                var html = '';

                data.forEach(function(currency){
                    var amount = total * currency.rate;
                    var display = pos_multic_format_currency(amount, currency);
                    html += '<tr><td>'+currency.ticket_label+'</td><td class="pos-right-align">'+display+'</td></tr>';
                });

                $('.pos-receipt-container .emph', self.$el).after(html);
            });
        },
    });


}
