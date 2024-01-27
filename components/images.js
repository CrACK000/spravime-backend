const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const config = require('../config/config')

const s3Client = new S3Client(config.s3);

const getImage = async function (req, res) {
    const dir = req.params.dir;
    const filename = req.params.img;  // Note the change here. It should be `img`, not `name`.
    const filekey = `${dir}/${filename}`;

    const command = new GetObjectCommand({
        Bucket: 'spravime',
        Key: filekey
    });

    try {
        const dataStream = await s3Client.send(command);
        dataStream.Body.pipe(res);
    } catch (error) {
        res.status(404).send({ error: 'Image not found' });
    }
}

module.exports = { getImage }