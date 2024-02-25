import {startFetchQueuing, stopFetchQueuing} from "./fetch-queue";

export interface DataChannelInit {
  tokenUrl: string;
  tokenAuthorization: string;
  dataChannelUrl: string;
}

startFetchQueuing();

export class PDataChannelElement extends HTMLElement {
  constructor() {
    super();

    this.#ready = Promise.all([
      new Promise<void>((resolve) => {
        navigator.serviceWorker.addEventListener(
          "message",
          (event: MessageEvent) => {
            if (event.data.type === "init") {
              stopFetchQueuing();
              resolve();
            } else {
              this.#handleMessage(event);
            }
          },
        );
      }),
      this.#initIframe(),
    ]);

    const serviceWorkerUrl = this.getAttribute("service-worker");
    if (serviceWorkerUrl) {
      navigator.serviceWorker
        .register(serviceWorkerUrl, {scope: document.location.pathname})
        .then((sw) => {
          this.#serviceWorkerRegistration = sw;
          this.#serviceWorkerRegistrationActive.then(() => {
            sw.active.postMessage({
              type: "init",
              tokenUrl: this.getAttribute("token-url"),
              pattern: this.getAttribute("pattern"),
            });
          });
        });
    }
  }

  #ready;

  #iframeElement: HTMLIFrameElement;

  #serviceWorkerRegistration: ServiceWorkerRegistration;

  #handleMessage = async (event: MessageEvent) => {
    await this.#ready;
    if (event.data.type === "fetch") {
      const result = await this.iframeFetch(
        event.data.url,
        event.data.init,
      ).catch((e) => e);

      event.ports[0].postMessage({
        result,
        error: result instanceof Error ? result.message : null,
      });
    }
  };

  #initIframe = async (): Promise<void> => {
    return new Promise((resolve, reject) => {
      this.#iframeElement = document.createElement("iframe");
      this.#iframeElement.onload = function () {
        resolve();
      };
      this.#iframeElement.onerror = function () {
        reject();
      };
      this.#iframeElement.style.display = "none";
      document.body.appendChild(this.#iframeElement);
      this.#iframeElement.src = this.getAttribute("data-channel-url");
    });
  };

  get #serviceWorkerRegistrationActive(): Promise<void> {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (this.#serviceWorkerRegistration?.active) {
          clearInterval(interval);
          resolve();
        }
      }, 100);
    });
  }

  async iframeFetch<T>(
    input: URL | RequestInfo,
    init?: RequestInit,
  ): Promise<T> {
    await this.#ready;
    return new Promise((resolve, reject) => {
      const channel = new MessageChannel();
      channel.port1.onmessage = (event: MessageEvent) => {
        if (event.data.response.error) {
          reject(new Error(event.data.response.error));
        } else {
          resolve(event.data.response.data);
        }
        channel.port1.close();
      };
      this.#iframeElement.contentWindow.postMessage(
        {input, init},
        new URL(this.#iframeElement.src).origin,
        [channel.port2],
      );
    });
  }
}

if (!customElements.get("p-data-channel")) {
  customElements.define("p-data-channel", PDataChannelElement);
}
