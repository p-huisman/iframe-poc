const path = require("path");
const bodyParser = require("body-parser");
const crypto = require("crypto");

const publicPem = `-----BEGIN PUBLIC KEY-----
MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgH115JfDEMa3OW7bQMwY80M6jzm8
I1Si+1NNeagnbbVTXP/MQ9eAN/OK+Ah5Wzv2kQgARMfSMbPlOsO3kY+Zks7gSTtT
8aTxGcKIEjYsR/lTof3iBDEwHvRpcF2iNjwzSawZTVu5e/cyhnDDrlur+MhMgPMm
YCtYFFtnpbDkMZBpAgMBAAE=
-----END PUBLIC KEY-----`;

// const privateKey = crypto.createPrivateKey(privatePem);
const publicKey = crypto.createPublicKey(publicPem);

module.exports = (app) => {
  app.use(bodyParser.json());

  app.get("/token", (req, res) => {
    const data = JSON.stringify({"bsn": "1234567890"});
    const encryptedData = crypto.publicEncrypt(
      {
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        // oaepHash: "sha256",
      },
      // We convert the data string to a buffer using `Buffer.from`
      // eslint-disable-next-line no-undef
      Buffer.from(data)
    );

    res.json({token: encryptedData.toString("base64")});
  });

};
