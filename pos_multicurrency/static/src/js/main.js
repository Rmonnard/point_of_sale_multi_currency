
openerp.pos_multicurrency = function(instance) {

    try {

	    var module = instance.point_of_sale;

	    openerp_pos_screens_custom(instance,module);    // import pos_screens.js
	    openerp_pos_models_custom(instance,module);
	    openerp_pos_widgets_custom(instance, module);

    }
	catch(err){
		alert('Javascript error: '+err.message);
	}
};

    
