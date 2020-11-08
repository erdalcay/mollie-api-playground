'use-strict';
const lodash = require('lodash');

/**
 * Class that creates JSON response for Shop's APIs
 *
 * @method get
 * @method createTitles
 * @method createHeaders
 * @method createRows
 * @method buildResponse
 */
class Response {

	constructor(type = 'payments') {
		this.model = {
			'type': type,
			'pageTitle': '',
			'tableTitle': '',
			'headers': [],
			'rows': [],
			'results': 0
		}
	}

	get() {
		return this.model;
	}

	createTitles() {
		const titles = {'payments': {'title': 'Payments', 'subtitle': 'Payment history of your organization'}, 'refunds': {'title': 'Refunds', 'subtitle': 'Issued refunds'}, 'orders': {'title': 'Orders', 'subtitle': 'Order history of your organization'}, 'methods': {'title': 'Methods', 'subtitle': 'Enabled payment methods for your organization'}}
		this.model.pageTitle = titles[this.model.type].title;
		this.model.tableTitle = titles[this.model.type].subtitle;
	}

	createHeaders() {
		const headers = {
			'payments': ['Method', 'Amount', 'Status', 'Details', 'Date', ''],
			'refunds': ['Refund ID', 'Amount', 'Status', 'Details', 'Date', ''],
			'orders': ['Total Amount', 'Status', 'Order Number', 'Expires At', 'Date', ''],
			'methods': ['Method', 'Status', 'Min. Amount', 'Max. Amount', '']
		}

		this.model.headers = headers[this.model.type];
	}

	createRows(data) {
		const models = {
			'payments': {'method': {'type': 'method', 'value': '', 'colType': 'rowHeader'}, 'amount': {'type': 'amount', 'value': '', 'colType': 'plain'}, 'status': {'type': 'status', 'value': '', 'colType': 'badge'}, 'description': {'type': 'details', 'value': '', 'colType': 'plain'}, 'createdAt': {'type': 'date', 'value': '', 'colType': 'plain'}, 'resource': {'type': 'action', 'value': '', 'colType': 'action'}},
			'refunds': {'id': {'type': 'method', 'value': '', 'colType': 'rowHeader'}, 'settlementAmount': {'type': 'amount', 'value': '', 'colType': 'plain'}, 'status': {'type': 'status', 'value': '', 'colType': 'badge'}, 'description': {'type': 'details', 'value': '', 'colType': 'plain'}, 'createdAt': {'type': 'date', 'value': '', 'colType': 'plain'}, 'resource': {'type': 'action', 'value': '', 'colType': 'action'}},
			'orders': {'amount': {'type': 'amount', 'value': '', 'colType': 'plain'}, 'status': {'type': 'status', 'value': '', 'colType': 'badge'}, 'orderNumber': {'type': 'method', 'value': '', 'colType': 'plain'}, 'expiresAt': {'type': 'date', 'value': '', 'colType': 'plain'}, 'createdAt': {'type': 'date', 'value': '', 'colType': 'plain'}, 'resource': {'type': 'action', 'value': '', 'colType': 'action'}},
			'methods': {'id': {'type': 'method', 'value': '', 'colType': 'rowHeader'}, 'status': {'type': 'status', 'value': '', 'colType': 'badge'}, 'minimumAmount': {'type': 'amount', 'value': '', 'colType': 'plain'}, 'maximumAmount': {'type': 'amount', 'value': '', 'colType': 'plain'}, 'resource': {'type': 'action', 'value': '', 'colType': 'action'}}
		}

		data.forEach((d) => {
			const row = [];
			const model = lodash.cloneDeep(models[this.model.type]);
			for (const [key, value] of Object.entries(model)) {
			  var column = value;
			  column.value = d[key] || 'N/A';
			  // Empty column
			  if (key === 'resource') {
			  	if (d[key] === 'payment') {
			  		column.value = 'Issue Refund';
			  	} else if (d[key] === 'refund') {
			  		column.value = 'Cancel Refund';
			  	} else if (d[key] === 'method') {
			  		column.value = 'Disable Method';
			  	} else if (d[key] === 'order') {
			  		if (d.isCancelable) {
			  			column.value = 'Cancel Order';	
			  		} else {
			  			column.value = 'This order can not be canceled.'
			  		}
			  	} else {}
			  }
		  	// Concat. currency + value
			  if (['amount', 'minimumAmount', 'maximumAmount', 'settlementAmount'].indexOf(key) > -1) {
			  	{column.value = d[key].currency + ' ' + d[key].value}
			  }
			  // Create row
			  row.push(column);
			}
			this.model.rows.push(row);
		});
		
	}

	buildResponse(data) {
		this.createTitles();
		this.createHeaders();
		this.createRows(data);
		this.model.results = this.model.rows.length;
		return this.get();
	}

}

module.exports = Response;