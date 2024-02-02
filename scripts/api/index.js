const path = require("path");
const fs = require("fs");
const bodyParser = require("body-parser");
const crypto = require("crypto");

const privatePem = `-----BEGIN RSA PRIVATE KEY-----
MIICXAIBAAKBgH115JfDEMa3OW7bQMwY80M6jzm8I1Si+1NNeagnbbVTXP/MQ9eA
N/OK+Ah5Wzv2kQgARMfSMbPlOsO3kY+Zks7gSTtT8aTxGcKIEjYsR/lTof3iBDEw
HvRpcF2iNjwzSawZTVu5e/cyhnDDrlur+MhMgPMmYCtYFFtnpbDkMZBpAgMBAAEC
gYA+LJSSWQsRT2/Y7jMYcizr3jNoa0IfCX3/dF+b455Mw/lMkw/z1gjkWrQ8jteV
ycVp76gmVpZnDmym3Wv3fCXyRXPWSq3EpCzygZLprWfQsDTOlH8ABcWAs8Oga94W
cvNHjGzWZNM+SzAyuz/kxy8GuaBRpAcBdDlChfqdkJ+NAQJBAOHNw+4WpkCX/i2u
i+mjIFfk+DsHK4yussdiP/vKo79EoKMPX1MukNWjBW2IeReKXtS7uMHDkKVLKkV6
OecOhFkCQQCOPPJDMFVlD6h2J7v6JZyGuOrHf4RAwaELsMnViVMs/Kd0QLTtC2aY
jZ0X+8spN+Yk73eOfjLZCm905JtdEiqRAkEAg2UxNkKHy96mUf7X+8So9XyP1gl+
FgcykUNi6CoqzwooT7qKReU68pZCelKH5GLoe/IguOAMM6NhnbxaJVIVQQJASHAB
cPZMhwtSX9ocgWhmLrY92xu13sS9n5aJM5acJW0GWs4ZVh9YQJjeSDiTXop5SpYp
7QeYHbCS0pUaCmwWAQJBAMio6f596eC4aQfoCdrQGpRuXF8VAu+FH1qpUFSXKd9+
5M+4bVe9VG4F/evrT3ChB9XxUENFIzRYtHxIawrG0t8=
-----END RSA PRIVATE KEY-----`;

const privateKey = crypto.createPrivateKey(privatePem);

module.exports = (app) => {
  app.use(bodyParser.json());

  app.get("/token", (req, res) => {
    const data = fs.readFileSync('./scripts/api/token.json', 'utf8');
    const encryptedData = crypto.privateEncrypt(
      {
        key: privateKey,
      },
      Buffer.from(data)
    );

    res.json({token: encryptedData.toString("base64")});
  });

};
