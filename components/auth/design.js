const db = require("../../config/db");
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const config = require('../../config/config')
const { S3Client, DeleteObjectCommand} = require('@aws-sdk/client-s3');
const { Upload } = require ('@aws-sdk/lib-storage');
const upload = multer({ dest: 'uploads/' });

const s3Client = new S3Client(config.s3);

const avatarUpload = function (req, res) {
    const errors = []
    let url = req.user.avatar
    let splitUrl = url.split('/')
    let oldAvatar = splitUrl[splitUrl.length - 1]

    const uploadSingle = upload.single("avatar");
    uploadSingle(req, res, async function (err) {
        if (err) {
            errors.push({
                where: 'error',
                message: err.message,
            });
            return res.send({
                success: false,
                errors: errors,
            });
        }

        const oldFileKey = "avatars/" + oldAvatar;

        const deleteCommand = new DeleteObjectCommand({
            Bucket: "spravime",
            Key: oldFileKey
        });

        try {
            await s3Client.send(deleteCommand);
        } catch (deleteError) {
            console.log("Error deleting file", deleteError);
            errors.push({
                where: 'error',
                message: "Cannot delete old avatar",
            });

            return res.send({
                success: false,
                errors: errors,
            });
        }

        const sourceData = fs.createReadStream(req.file.path);
        const filename = `${Date.now().toString()}-[${req.user.username.toLowerCase()}]${path.extname(req.file.originalname)}`;
        const targetKey = "avatars/" + filename;

        try {
            const uploader = new Upload({
                client: s3Client,
                params: {
                    Bucket: "spravime",
                    Key: targetKey,
                    Body: sourceData,
                },
            });

            try {
                const uploadResult = await uploader.done();
                console.log(uploadResult)

                const userId = req.user.id;
                const newAvatar = config.account.avatarPath + filename

                db.query('UPDATE users SET avatar = ? WHERE id = ?', [newAvatar, userId], function(err, results) {
                    if (err) {
                        errors.push({
                            where: 'error',
                            message: 'Chyba pri aktualizácii údajov.'
                        });

                        res.send({
                            success: false,
                            errors: errors
                        })
                    } else {
                        res.send({
                            success: true,
                            message: 'Profilový obrázok bol aktualizovaný.',
                            newAvatar: newAvatar
                        })
                    }
                })
            } catch (err) {
                errors.push({
                    where: 'error',
                    message: err.message,
                });

                return res.send({
                    success: false,
                    errors: errors,
                });
            }
        } catch (error) {
            errors.push({
                where: 'error',
                message: error.message,
            });

            return res.send({
                success: false,
                errors: errors,
            });
        }
    });
};

module.exports = { avatarUpload };