import {PDataChannelElement} from "./p-data-channel";
import {waitForSelector} from "@pggm/test-helpers";
describe("p-component custom element", () => {
  it("is defined", async () => {
    expect(PDataChannelElement).toBeDefined();
    await customElements.whenDefined("p-data-channel");
  });
});
