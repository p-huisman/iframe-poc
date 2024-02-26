export type {};

interface IframeFetchServiceWorkerGlobalScope extends ServiceWorkerGlobalScope {
  token: string | Error;
  pattern: string;
}

declare let self: IframeFetchServiceWorkerGlobalScope;

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event: ExtendableEvent) => {
  event.waitUntil(self.clients.claim());
});

self.token = null;
self.pattern = null;

self.addEventListener("message", async (event: ExtendableMessageEvent) => {
  const eventClient = event.source as WindowClient;
  const data = event.data;
  if (data.type === "init") {
    self.token = await getToken(data.tokenUrl).catch((e) => e);
    self.pattern = data.pattern;
    if (self.token instanceof Error) {
      eventClient.postMessage({
        type: "init",
        data: null,
        error: self.token.message,
      });
      return;
    }
    eventClient.postMessage({type: "init", data: true});
  }
});

async function getToken(tokenUrl: string): Promise<string> {
  const tokenData = await fetch(tokenUrl)
    .then((r) => r.json())
    .catch((e) => e);
  if (tokenData instanceof Error && tokenData) {
    return Promise.reject(tokenData);
  }
  return tokenData.token
    ? tokenData.token
    : Promise.reject(new Error("Token not found"));
}

self.addEventListener("fetch", (e: FetchEvent) => {
  e.respondWith(
    (async function () {
      if (e.request.url.match(self.pattern)) {
        return await fetchInIframe(e.clientId, e.request);
      } else {
        return await fetch(e.request);
      }
    })(),
  );
});

async function fetchInIframe(
  clientId: string,
  request: Request,
): Promise<Response> {
  const clients = await self.clients.matchAll({type: "window"});
  const client = clients.find((c) => c.id === clientId);
  if (!client) {
    return Promise.reject(new Error("Client not found"));
  }
  return new Promise((resolve) => {
    const messageChannel = new MessageChannel();
    messageChannel.port1.onmessage = (event: MessageEvent) => {
      if (event.type === "fetchResponse" && event.data.result.error) {
        console.error(event.data);
        resolve(
          new Response(event.data.result, {
            status: event.data.result.status,
            statusText: event.data.result.statusText,
          }),
        );
      } else {
        resolve(
          new Response(JSON.stringify(event.data.result.data), {
            status: event.data.result.status,
            headers: {"Content-Type": "application/json"},
          }),
        );
      }
      messageChannel.port1.close();
    };
    const init = {
      method: request.method,
      headers: {...request.headers},
      body: request.body,
    } as any;

    init.headers["x-remote-fetch-token"] = self.token;

    client.postMessage({type: "fetch", url: request.url, init}, [
      messageChannel.port2,
    ]);
  });
}
