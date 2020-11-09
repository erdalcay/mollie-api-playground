'use-strict';
const path = require('path');
const Datastore = require('nedb');
const paymentsdb = new Datastore({
  filename: path.join(__dirname, '/payments.db'), autoload: true
});
paymentsdb.persistence.setAutocompactionInterval(5);

/*
 * Wrapper class for db
 *
 * @param {string} db - database name
 *
 * @method create 
 * @method retrieve
 * @method update
 * @method getAll
 */
class DB {
  constructor(db = 'payments') {
    this.db = paymentsdb;
    /*
      if (db === 'orders') {
        this.db = ordersdb;
      } else if (db === 'payments') {
        this.db = paymentsdb;
      } else if (db === 'refunds') {
        this.db = refundsdb;
      } else {
        this.db = miscdb;
      }
    */
  }

  /**
   * Inserts a new document into DB
   *
   * @param {object} document - Order details
   * @param {string} [document.orderId] - Order Id
   * @param {string} [document.paymentId] - Payment Id for the order
   * @param {string} [document.paymentStatus] - Status of the payment
   * @param {string} [document.productId] - Id of the purchased product
   * @field {date} [document.createdAt] - Time stamp
   * @field {date} [document.updatedAt] - Time stamp
   */
  insert(document) {
    // Add time stamps
    document.createdAt = document.updatedAt = Date.now();

    return new Promise((resolve, reject) => {
      this.db.insert(document, (err, doc) => {
        if (!err) {
          resolve(true);
        } else {
          reject(false);
        }
      });
    });
  }

  /**
   * Finds a document
   *
   * @param {string} orderId - Field to query the db on
   */
  retrieve(orderId) {
    return new Promise((resolve, reject) => {
      this.db.findOne({ orderId }, (err, doc) => {
        if (!err) {
          resolve(doc);
        } else {
          reject({});
        }
      });
    });
  }

  /**
   * Retrieves all documents
   *
   */
  getAll() {
    return new Promise((resolve, reject) => {
      this.db.find({}, (err, docs) => {
        if (!err) {
          resolve(docs);
        } else {
          reject([]);
        }
      });
    });
  }

  /**
   * Updates a document
   *
   * @param {string} paymentId - Field to query the db on to find the document for the update
   * @param {string} paymentStatus - New status of the payment - updates document.paymentStatus
   */
  update(paymentId, paymentStatus) {
    return new Promise((resolve, reject) => {
      this.db.update(
        { paymentId },
        { $set: { paymentStatus, updatedAt: Date.now() }},
        (err, rows) => {
          if (!err) {
            resolve(true);
          } else {
            reject(false);
          }
      });
    });
  }
}

module.exports = DB;