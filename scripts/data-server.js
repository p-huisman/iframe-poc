const express = require("express");
const path = require("path");

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

const crypto = require("crypto");
const privateKey = crypto.createPrivateKey(privatePem);

const decodeToken = (token) => {
  const decryptedData = crypto.privateDecrypt(
    {
      key: privateKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
    },
    // eslint-disable-next-line no-undef
    Buffer.from(token, "base64")
  );
  return JSON.parse(decryptedData.toString());
};

const app = express({strict: false});

app.get("/data-channel", (req, res) => {
  res.send(`
<html>
    <head>
        <script>
            window.addEventListener("message", async (event) => {
                if (event.origin !== "http://localhost:9000") {
                    return;
                }
                let response = await fetch(event.data.input, event.data.init).catch(e => e);
                const status = response.status;

                response = await response.json().catch(e => e);
                if (response instanceof Error) {
                    response = {
                        status,
                        error: response.message,
                        stack: response.stack
                    };
                }
                event.ports[0].postMessage({status, data: response});
            });
        </script>
    </head>
    <body>
    </body>
</html>`);
});

app.get("/data-sample-request", (req, res) => {
  const token = decodeToken(req.headers["x-remote-fetch-token"]);
  res.json({message: "Hello " + token.bsn});
});

app.get("/data-sample-request-2", async (req, res) => {
  // turn off certificate validation (self signed certificate in chain)
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"
  const token = decodeToken(req.headers["x-remote-fetch-token"]);
  if (token.bsn !== "1234567890") {
    return res.status(401).json({error: "Unauthorized"});
  }
  let data = await fetch("https://jsonplaceholder.typicode.com/posts").catch(e => e);
  data = await data.json().catch(e => e);
  res.json(data);
});

app.listen("9001", () => {
  console.log(`Data server listening on port 9001`)
})
