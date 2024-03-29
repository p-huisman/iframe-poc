import {startFetchQueuing, stopFetchQueuing} from "./fetch-queue";

export interface IframeFetchInit {
  tokenUrl: string;
  tokenAuthorization: string;
  iframeUrl: string;
}

startFetchQueuing();

export class PIframeFetchElement extends HTMLElement {
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
      const result = await this.#iframeFetch(event.data.url, event.data.init);
      event.ports[0].postMessage({
        type: "fetchResponse",
        result,
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
      this.#iframeElement.src = this.getAttribute("iframe-url");
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

  async #iframeFetch<T>(
    input: URL | RequestInfo,
    init?: RequestInit,
  ): Promise<T> {
    await this.#ready;
    return new Promise((resolve) => {
      const channel = new MessageChannel();
      channel.port1.onmessage = (event: MessageEvent) => {
        if (event.data.response) {
          resolve(event.data.response);
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

if (!customElements.get("p-iframe-fetch")) {
  customElements.define("p-iframe-fetch", PIframeFetchElement);
}
