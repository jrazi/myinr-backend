
module.exports.asyncFunctionWrapper = function asyncFunctionWrapper(func) {

    const wrapper = async (req, res, next) => {
        try {
            const result = await func(req, res, next);
        } catch(err) {
            console.log(err);
            next(err);
        }
    }
    return wrapper;
}