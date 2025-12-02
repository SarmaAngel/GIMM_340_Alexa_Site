//Pulling in the functionality from connection.js
const connection = require('./connection');

//'async' gives us access to 'await' keyword
//   'await' is a promise
async function getAllGoods(parameters = {}) {
    let selectSql = `SELECT
            goods.id,
            goods.product_name,
            goods.is_stocked,
            goods.amount,
            type.name
        FROM goods
        INNER JOIN type on type.id = goods.type_id`,
        whereStatements = [],
        orderByStatements = [],
        queryParameters = [];

    if (typeof parameters.productName !== 'undefined' && parameters.productName.length > 0) {
        //set up where statement for title
        whereStatements.push('product_name LIKE ?');
        queryParameters.push('%' + parameters.productName + '%');
    }

    if (typeof parameters.isStocked !== 'undefined' && parameters.isStocked.length > 0) {
        let isStockedValue = parameters.isStocked.toLowerCase() === 'yes' ? 1 : 0;
        whereStatements.push('goods.is_stocked = ?');
        queryParameters.push(isStockedValue);
    }

    if (typeof parameters.amount !== 'undefined' && parameters.amount.length > 0) {
        //set up where statement for amount
        whereStatements.push('amount = ?');
        queryParameters.push(parameters.amount);
    }

    if (typeof parameters.type !== 'undefined' && parameters.type.length > 0) {
        //set up where statement for type of product
        whereStatements.push('type.id = ?');
        queryParameters.push(parameters.type);
    }

}

async function insert(parameters = {}) {
    let insertSql = 'INSERT INTO goods (product_name, type_id, amount, is_stocked) VALUES (?, ?, ?, ?, ?)';
    queryParameters = [
        parameters.productName,
        parameters.type,
        parseInt(parameters.amount) > 0 ? parseInt(parameters.amount) : null,
        parameters.isStocked.toLowerCase() === 'yes' ? 1 : 0
    ];

    //STOP!!! Run this database querey and then return the results
    return await connection.query(insertSql, queryParameters);

}

async function edit(id, parameters = {}) {
    console.log(parameters);
    let updateSql = `UPDATE goods 
                        SET product_name = ?, 
                            type_id = ?, 
                            amount = ?, 
                            is_stocked = ?
                     WHERE id = ?`,
        queryParameters = [
            parameters.productName,
            parameters.type,
            parseInt(parameters.isStocked),
            parseInt(parameters.amount) > 0 ? parseInt(parameters.amount) : null,
            id
        ];
    //STOP!!! Run this database querey and then return the results
    return await connection.query(updateSql, queryParameters);

}

async function remove(id) {
    let removeSql = `DELETE FROM games WHERE id = ?`,
        queryParameters = [parseInt(id)];
    //STOP!!! Run this database querey and then return the results
    return await connection.query(removeSql, queryParameters);
}

//Gives access to the getAll() method
module.exports = {
    getAllGoods,
    getByID,
    insert,
    edit,
    remove
}