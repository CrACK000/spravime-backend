module.exports = {
    account: {
        avatarPath: 'https://spravime-app.up.railway.app/images/avatars/'
    },
    s3: {
        credentials: {
            accessKeyId: process.env.ACCESS_KEY_ID,
            secretAccessKey: process.env.SECRET_ACCESS_KEY,
        },
        region: "eu-north-1"
    }
}