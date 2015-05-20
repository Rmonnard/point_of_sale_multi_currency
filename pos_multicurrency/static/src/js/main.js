
openerp.pos_multicurrency = function(instance) {

    //instance.point_of_sale = {};

    var module = instance.point_of_sale;

    openerp_pos_screens_custom(instance,module);    // import pos_screens.js

    //instance.web.client_actions.add('pos.ui', 'instance.point_of_sale.PosWidget');
};

    
