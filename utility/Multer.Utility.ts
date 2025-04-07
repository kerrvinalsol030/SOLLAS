import multer from 'multer'


const imgStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images')
    },
    filename: function (req, file, cb) {
        cb(null, String(new Date().toISOString() + file.originalname).replace(/:/g, ''))
    }
})

const images = multer({ storage: imgStorage }).array('images', 10)

export { images }