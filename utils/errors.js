module.exports = {
  BAD_REQUEST: {
    STATUS: 400,
    DEFAULT_MESSAGE: 'INVALID REQUEST DATA',
  },
  NOT_FOUND:  {
    STATUS: 404,
    DEFAULT_MESSAGE: 'REQUESTED RESOURCE NOT FOUND',
  },
  INTERNAL_SERVER_ERROR: {
    STATUS: 500,
    DEFAULT_MESSAGE: 'AN ERROR HAS OCCURED ON THE SERVER',
  }
};


// res.status(BAD_REQUEST).send({
//   message:"Requested resource not found",
// })


// 400 — invalid data passed to the methods for creating an item/user or updating an item, or invalid ID passed to the params.
// 404 — there is no user or clothing item with the requested id, or the request was sent to a non-existent address.
// 500 — default error. Accompanied by the message: "An error has occurred on the server."