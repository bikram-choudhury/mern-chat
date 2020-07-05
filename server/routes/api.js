const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        const { meetingId } = req.params;
        const targetFolder = `${__dirname}/../uploads/${meetingId}`;

        if (!fs.existsSync(targetFolder)) {
            fs.mkdirSync(targetFolder);
        }
        callback(null, targetFolder);
    },
    filename: function (req, file, callback) {
        callback(null, Date.now() + '-' + file.originalname)
    }
});

const upload = multer({ storage: storage }).single('file');

router.post('/uploadFiles/:meetingId', upload, (request, response) => {

    upload(request, response, error => {
        if (error) {
            return response.status(500).send(error);
        } else {
            const { meetingId } = request.params;
            const filePath = `${meetingId}/${response.req.file.filename}`;
            return response.json({ filePath });
        }
    })
});

module.exports = router;