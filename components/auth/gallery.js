const config = require('../../config/config')
const db = require("../../config/db");
const path = require('path');
const fs = require('fs');
const { S3Client, PutObjectCommand, DeleteObjectCommand} = require('@aws-sdk/client-s3');
const multiparty = require('multiparty');

const s3Client = new S3Client(config.s3);

const uploadGallery = async (req, res) => {
    const errors = []
    const userId = req.user.id
    const form = new multiparty.Form();

    form.parse(req, async (err, fields, files) => {
        if (err) {
            errors.push({
                where: 'error',
                message: err,
            })

            return res.send({
                success: false,
                errors: errors,
            })
        }

        for (const file of files.files) {
            const fileStream = fs.createReadStream(file.path);
            let randomString = Math.random().toString(36).substring(2, 17);
            const extension = file.originalFilename.split(".").pop();
            const filename = `${randomString}-[${req.user.username.toLowerCase()}].${extension}`;

            const uploadParams = {
                Bucket: 'spravime',
                Key: `galleries/${filename}`,
                Body: fileStream
            }
            const command = new PutObjectCommand(uploadParams);

            try {
                await s3Client.send(command);
                console.log('File uploaded');

                const currentTime = new Date().toISOString().slice(0, 19).replace('T', ' ');

                db.query('INSERT INTO galleries (user_id, path, description, created_at) VALUES(?, ?, ?, ?)',
                    [userId, filename, '', currentTime], function(err, result) {

                        if(err) {
                            errors.push({
                                where: 'error',
                                message: 'Chyba pri zapisovaní údajov.',
                            })
                        }
                    });

            } catch (err) {
                errors.push({
                    where: 'error',
                    message: 'Error uploading file: ', err,
                })
            }
        }

        // Send final response
        if (errors.length > 0) {
            return res.send({
                success: false,
                errors: errors,
            });
        } else {
            return res.send({
                success: true,
                message: 'Obrázky boli pridané do galérie.',
            });
        }
    });
}

const deleteImages = (req, res) => {
    const errors = []
    const { imageIds } = req.body;

    db.query('SELECT id, path FROM galleries WHERE id IN (?)', [imageIds], function(err, results) {
        if(err) {
            errors.push({
                where: 'error',
                message: 'Chyba nezískali sa data obrázku.',
            })

            return res.send({
                success: false,
                errors: errors,
            })
        } else {
            const deletedFromS3 = [];

            for(let file of results) {
                const deleteParams = {
                    Bucket: 'spravime',
                    Key: `galleries/${file.path}`
                }
                const command = new DeleteObjectCommand(deleteParams);

                try {
                    s3Client.send(command);
                    console.log('File deleted');
                    deletedFromS3.push(file.id);
                } catch (err) {
                    console.error('Error deleting file: ', err);
                }
            }

            if (deletedFromS3.length > 0) {
                db.query('DELETE FROM galleries WHERE id IN (?)', [deletedFromS3], function(err) {
                    if(err) {
                        errors.push({
                            where: 'error',
                            message: 'Chyba pri odstraňovaní obrázka.',
                        })

                        return res.send({
                            success: false,
                            errors: errors,
                        })
                    } else {
                        res.send({
                            success: true,
                            message: 'Obrázky boli vymazané.',
                        })
                    }
                });
            } else {
                errors.push({
                    where: 'error',
                    message: 'Žiadne obrázky na vymazanie.',
                })

                res.send({
                    success: false,
                    message: errors,
                })
            }
        }
    });
}

module.exports = { uploadGallery, deleteImages };