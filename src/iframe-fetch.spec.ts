import {PIframeFetchElement} from "./iframe-fetch";
// import {waitForSelector} from "@pggm/test-helpers";
describe("p-component custom element", () => {
  it("is defined", async () => {
    expect(PIframeFetchElement).toBeDefined();
    await customElements.whenDefined("p-iframe-fetch-channel");
  });
});
