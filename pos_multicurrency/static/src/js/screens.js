function openerp_pos_screens_custom(instance, module){ //module is instance.point_of_sale
    var QWeb = instance.web.qweb,
    _t = instance.web._t;

    var round_pr = instance.web.round_precision

    module.PaymentScreenWidget = module.PaymentScreenWidget.extend({

        var round_di = instance.web.round_decimals;

        init:function(parent, dataset, view_id, options){
            this._super.apply(this, arguments);
            this.changeRate = 0.90;
        },
        
        update_payment_summary: function() {
            var currentOrder = this.pos.get('selectedOrder');
            var paidTotal = currentOrder.getPaidTotal();
            var dueTotal = currentOrder.getTotalTaxIncluded();
            var remaining = dueTotal > paidTotal ? dueTotal - paidTotal : 0;
            var change = paidTotal > dueTotal ? paidTotal - dueTotal : 0;

            var otherCurrencyAmount = dueTotal * this.changeRate;

            var otherCurrency = round_di(otherCurrencyAmount,2).toFixed(2);


            this.$('.payment-due-total').html(this.format_currency(dueTotal)+'<div>'+otherCurrency+' €'+'</div>');
            this.$('.payment-paid-total').html(this.format_currency(paidTotal));
            this.$('.payment-remaining').html(this.format_currency(remaining));
            this.$('.payment-change').html(this.format_currency(change));
            if(currentOrder.selected_orderline === undefined){
                remaining = 1;  // What is this ? 
            }
                
            if(this.pos_widget.action_bar){
                this.pos_widget.action_bar.set_button_disabled('validation', !this.is_paid());
                this.pos_widget.action_bar.set_button_disabled('invoice', !this.is_paid());
            }
        },
    });
}
