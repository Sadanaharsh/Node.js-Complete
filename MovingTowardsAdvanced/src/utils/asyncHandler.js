
// Using promises -> 
const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).
        catch((err) => next(err))
    }
}

// await asyncHandler(function hello())
 
// This is just a wrapper function that we will be using in the other files.
// Using try-catch.
// const asyncHandler = (fn) => async (req, res, next) => {
//     try {
//         await fn(req, res, next);
//     } catch (error) {
//         res.status(err.code || 500).json({
//             succes: false,
//             message: err.message
//         })
//     }
// }

export {asyncHandler};

