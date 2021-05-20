const {ValidationError} = require('sequelize');
const errors = require('../errors');

module.exports.asyncFunctionWrapper = function asyncFunctionWrapper(func) {

    const wrapper = async (req, res, next) => {
        try {
            const result = await func(req, res, next);
        } catch(err) {
            console.log(err);
            if (err instanceof ValidationError) {
                next(new errors.Vali)
            }
            else {
                next(err);
            }
        }
    }
    return wrapper;
}