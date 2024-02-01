export interface DataChannelInit {
  tokenUrl: string;
  tokenAuthorization: string;
  dataChannelUrl: string;
}

export class PDataChannelElement extends HTMLElement {
  static #iframeElement: HTMLIFrameElement;

  static #remoteFetchToken: string;

  static async init(init: DataChannelInit): Promise<void> {
    const response = await fetch(init.tokenUrl, {
      headers: {
        Authorization: `Bearer ${init.tokenAuthorization}`,
      },
    })
      .then((r) => r.json())
      .catch((e) => e);

    if (response instanceof Error) {
      return Promise.reject(response);
    }
    PDataChannelElement.#remoteFetchToken = response.token;

    if (!PDataChannelElement.#iframeElement) {
      return new Promise((resolve, reject) => {
        PDataChannelElement.#iframeElement = document.createElement("iframe");
        PDataChannelElement.#iframeElement.onload = function (e) {
          resolve();
        };
        PDataChannelElement.#iframeElement.onerror = function () {
          reject();
        };
        PDataChannelElement.#iframeElement.style.display = "none";
        document.body.appendChild(PDataChannelElement.#iframeElement);
        PDataChannelElement.#iframeElement.src = init.dataChannelUrl;
      });
    }
  }

  static async fetch<T>(
    input: URL | RequestInfo,
    init?: RequestInit,
  ): Promise<T> {
    init = init || {};
    init.headers = init.headers || ({} as Headers);
    (init.headers as any)["X-Remote-Fetch-Token"] =
      PDataChannelElement.#remoteFetchToken;
    return new Promise((resolve, reject) => {
      const channel = new MessageChannel();
      channel.port1.onmessage = (event: MessageEvent) => {
        if (event.data.response.error) {
          reject(new Error(event.data.response.error));
        } else {
          resolve(event.data);
        }
        channel.port1.close();
      };
      PDataChannelElement.#iframeElement.contentWindow.postMessage(
        {input, init},
        new URL(PDataChannelElement.#iframeElement.src).origin,
        [channel.port2],
      );
    });
  }
}

if (!customElements.get("p-data-channel")) {
  customElements.define("p-data-channel", PDataChannelElement);
}
