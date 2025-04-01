class ErrorWithStatus extends Error{
    constructor(message, status){
        super(message)
        this.status = status
    }
}

const errCont = {}

/* ***************************
 *  Intentionally throw an error
 * ************************** */
errCont.throwError = async function(req, res, next){
    throw new ErrorWithStatus("'That was deliberate!' --Gimli son of Gloin",500)
}


module.exports = errCont