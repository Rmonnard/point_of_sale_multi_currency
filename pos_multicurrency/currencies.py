# -*- coding: utf-8 -*-
from openerp.osv import orm, fields


class pos_multicurrency_currencies(orm.Model):
	_name="pos_multicurrency.currencies"

	_columns={
		'name' : fields.char('Currency Name', select=1, required=True, help="An internal identification of the currency"),
		'ticket_label' : fields.char('Label on ticket', required=True),
		'currency_id': fields.many2one('res.currency','Currency',required=True),
		'rate': fields.float(string='Currency Change'),
		'active': fields.boolean('Active'),
	}


	def getAdditionalCurrencies(self, cr, user):
		ret = []

		active_ids = self.search(cr, user, [("active", "=", "1")])

		for record in self.browse(cr, user, active_ids):
			ret += [{
				'name': record.name,
				'rate': record.rate,
				'symbol': record.currency_id.symbol,
				'position': record.currency_id.position,
				'ticket_label': record.ticket_label
			}]
		return ret

	
pos_multicurrency_currencies()
