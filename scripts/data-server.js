const express = require("express");

const publicPem = `-----BEGIN PUBLIC KEY-----
MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgH115JfDEMa3OW7bQMwY80M6jzm8
I1Si+1NNeagnbbVTXP/MQ9eAN/OK+Ah5Wzv2kQgARMfSMbPlOsO3kY+Zks7gSTtT
8aTxGcKIEjYsR/lTof3iBDEwHvRpcF2iNjwzSawZTVu5e/cyhnDDrlur+MhMgPMm
YCtYFFtnpbDkMZBpAgMBAAE=
-----END PUBLIC KEY-----`;

const crypto = require("crypto");
const publicKey = crypto.createPublicKey(publicPem);

const decodeToken = (token) => {
  const decryptedData = crypto.publicDecrypt(
    {
      key: publicKey,
    },
    Buffer.from(token, "base64"),
  );
  return JSON.parse(decryptedData.toString());
};

const app = express({strict: false});

app.get("/data-channel", (req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.send(`
<!DOCTYPE html>
<html>
    <head>
        <script>
            window.addEventListener("message", async (event) => {
                if (event.origin !== "http://localhost:9000") {
                  const errorResponse = {
                      status: 403,
                      error: "Access denied"
                  };
                  event.ports[0].postMessage({response: errorResponse});
                  return;
                }
                let data = null;
                let response = await fetch(event.data.input, event.data.init).catch(e => e);
                const status = response.status;
                if (response instanceof Error || response.ok === false) {
                  const errorResponse = {
                      status,
                      error: response.message ? response.message : response.statusText
                  };
                  event.ports[0].postMessage({response: errorResponse});
                  return;
                }
                data = await response.json().catch(e => e);
                event.ports[0].postMessage({response: {status, data}});
            });
        </script>
    </head>
    <body>
    </body>
</html>`);
});

app.get("/api/data-sample-request", (req, res) => {
  const token = decodeToken(req.headers["x-remote-fetch-token"]);
  res.json({message: "Hello " + token.bsn});
});

app.get("/api/data-sample-request-2", async (req, res) => {
  // turn off certificate validation (self signed certificate in chain)
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  const token = decodeToken(req.headers["x-remote-fetch-token"]);
  if (token.bsn !== "1234567890") {
    return res.status(401).json({error: "Unauthorized"});
  }
  let data = await fetch("https://jsonplaceholder.typicode.com/posts").catch(
    (e) => e,
  );
  data = await data.json().catch((e) => e);
  res.json(data);
});

app.listen("9001", () => {
  console.log(`Data server listening on port 9001`);
});
