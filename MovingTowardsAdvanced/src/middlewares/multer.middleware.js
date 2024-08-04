// Jahan jahan mai file upload ki functionality likhunga, wahan mai multer ka use karunga.

import multer from "multer";

// there are two options disk storage and memory storage, but here we are using disk storage.
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // req ke andar hume json data wagerah mil jaata hai jo ki express configure kar leta hai,
        // and file ke andar hume file milti hai, so because of that we use multer.
        // cb is the callback. First parameter is the error and the second parameter is the destination.
      cb(null, './public/temp')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      // here also the second parameter is the file name jo ki tumhe rakhna ho.
      cb(null, file.originalname)
    }
  })
  
export const upload = multer({ storage: storage })
  