const mysql = require('./dbWrapper')

class DAO {

  /**
   * This property can be overriden when the ID column is differet from 'id'
   */
  static get PRIMARY_KEY() {
    return "ID"
  }

  /**
   * Retrieves a single entry matching the passed ID
   * @param {Number} id - The entry ID
   */
  static async find(id) {
    return (await mysql.createQuery({
      query: `SELECT * FROM ?? WHERE ?? = ? LIMIT 1;`,
      params: [this.TABLE_NAME, this.PRIMARY_KEY, id]
    })).shift()
  }

  /**
   * Retrieves all entries on the extending class' table
   */
  static findAll() {
    return mysql.createQuery({
      query: `SELECT * FROM ??;`,
      params: [this.TABLE_NAME]
    });
  }

  /**
   * Find entries by their fields
   * @param {Object} fields - The fields to be matched
   * @param {Object} limit - Limits the amount of returned entries
   * @param {Object} order - Orders the returned entries using a provided field
   */
  static findByFields({
    fields,
    page = {
      currentPage: 1,
      pageSize: 10,
    },
    order
  }) {
    let baseQuery = `SELECT * FROM ??`

    let params = [this.TABLE_NAME]

    Object.keys(fields).forEach((key, index) => {
      if (index === 0) baseQuery += " WHERE "
      baseQuery += `${key} = ?`
      params.push(fields[key])
      if (index + 1 !== Object.keys(fields).length) baseQuery += " AND "
    })

    if (order != null && order.by != null && order.direction != null) {
      baseQuery += " ORDER BY ??"
      baseQuery += order.direction.toLowerCase() === 'desc' ? " DESC" : " ASC"
      params.push(order.by)
    }
    // handle page
    {
      baseQuery += " LIMIT ?, ?"
      const currentPage = page.currentPage > 0 ? page.currentPage : 1;
      const pageSize = page.pageSize > 0 ? page.pageSize : 10;
      params.push((currentPage - 1) * pageSize, pageSize)
    }

    console.log('baseQuery', baseQuery);
    console.log('params', params);
    return mysql.createQuery({
      query: baseQuery,
      params
    })
  }

  static list(_, fields) {
    let currentPage = 1;
    let pageSize = 10;
    if (fields.currentPage !== undefined) {
      currentPage = fields.currentPage;
      Reflect.deleteProperty(fields, 'currentPage');
    }
    if (fields.pageSize !== undefined) {
      pageSize = fields.pageSize;
      Reflect.deleteProperty(fields, 'pageSize');
    }
    return this.findByFields({
      fields,
      page: {
        currentPage,
        pageSize,
      },
      order: {
        direction: 'desc',
        by: 'ID'
      }
    });
  }

  /**
   * Updates an entry
   * @param {MySQL.Connection} connection - The connection which will do the update. It should be immediatelly released unless in a transaction
   * @param {Object} data - The data fields which will be updated
   * @param {Number} id - The ID of the entry to be updated
   */
  static update(connection, {
    data,
    id
  }) {
    return mysql.createTransactionalQuery({
      query: `UPDATE ??
                    SET ?
                    WHERE ?? = ?;`,
      params: [this.TABLE_NAME, data, this.PRIMARY_KEY, id],
      connection
    })
  }

  /**
   * Inserts a new entry
   * @param {MySQL.Connection} connection - The connection which will do the insert. It should be immediatelly released unless in a transaction
   * @param {Object} data - The fields which will populate the new entry
   */
  static insert(connection, {
    data
  }) {
    return mysql.createTransactionalQuery({
      query: `INSERT INTO ${this.TABLE_NAME}
                    SET ?;`,
      params: [data],
      connection
    })
  }

  /**
   * Deletes an entry
   * @param {MySQL.Connection} connection - The connection which will do the deletion. It should be immediatelly released unless in a transaction
   * @param {Number} id - The ID of the entry to be deleted
   */
  static delete(connection, {
    id
  }) {
    return mysql.createTransactionalQuery({
      query: `DELETE FROM  ??
                    WHERE ?? = ?;`,
      params: [this.TABLE_NAME, this.PRIMARY_KEY, id],
      connection
    })
  }
}

module.exports = DAO