function openerp_pos_screens_custom(instance, module){ //module is instance.point_of_sale
    var QWeb = instance.web.qweb,
    _t = instance.web._t;

    var round_pr = instance.web.round_precision;
    var round_di = instance.web.round_decimals;

    var pos_multic_format_currency = function(amount,currency){
        var decimals = 2;//currency.decimals;

        if (typeof amount === 'number') {
            amount = round_pr(amount, currency.rounding)
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
            var currentOrder = this.pos.get('selectedOrder');
            var paidTotal = currentOrder.getPaidTotal();
            var dueTotal = currentOrder.getTotalTaxIncluded();
            var remaining = dueTotal > paidTotal ? dueTotal - paidTotal : 0;
            var change = paidTotal > dueTotal ? paidTotal - dueTotal : 0;

            var otherLines = $('<div>').css({'font-size': '24px'});

            this.pos.pos_multicurrency_data.forEach(function(currency){
                var amount = dueTotal * currency.rate;
                var display = pos_multic_format_currency(amount, currency);
                otherLines.append($('<div>').text(display));
            });

            var due_total = $('<div>');
            due_total.append($('<div>').html(this.format_currency(dueTotal)));
            due_total.append(otherLines);

            this.$('.payment-due-total').html(due_total);
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


    module.ReceiptScreenWidget = module.ReceiptScreenWidget.extend({

        refresh: function() {
            this._super.apply(this, arguments);

            var order = this.pos.get('selectedOrder');
            var total = order.getTotalTaxIncluded();

            var html = '';

            this.pos.pos_multicurrency_data.forEach(function(currency){
                var amount = total * currency.rate;
                var display = pos_multic_format_currency(amount, currency);
                html += '<tr><td>'+currency.ticket_label+'</td><td class="pos-right-align">'+display+'</td></tr>';
            });

            $('.pos-receipt-container .emph', this.$el).after(html);
        },
    });

}
