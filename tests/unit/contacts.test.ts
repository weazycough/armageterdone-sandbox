// Other people's contact details come out of republished text; the show's
// own addresses stay.

import { describe, expect, it } from "vite-plus/test";
import {
  CONTACT_REMOVED,
  isShowEmail,
  redactContacts,
  redactContactsHtml,
} from "../../app/lib/contacts";
import { sanitizeNotes } from "../../app/lib/feed";

describe("isShowEmail", () => {
  it("knows the show's addresses and canarycry… mailboxes at its providers", () => {
    expect(isShowEmail("CanaryCrySupplyDrop@gmail.com")).toBe(true);
    expect(isShowEmail("canarycrynewsdesk@proton.me")).toBe(true);
    expect(isShowEmail("canarycryfan@example.org")).toBe(false);
    expect(isShowEmail("a.producer@gmail.com")).toBe(false);
  });
});

describe("redactContacts", () => {
  it("removes other addresses and phone numbers, keeps the show's and dates", () => {
    expect(
      redactContacts(
        "Write a.producer@gmail.com or canarycryradio@gmail.com, call (417) 555-0146 by 10.21.2026",
      ),
    ).toBe(
      `Write ${CONTACT_REMOVED} or canarycryradio@gmail.com, call ${CONTACT_REMOVED} by 10.21.2026`,
    );
  });

  it("keeps the show's own Textedly number", () => {
    expect(redactContacts("Text UNSTOP CANARY to 877-740-3226")).toBe(
      "Text UNSTOP CANARY to 877-740-3226",
    );
  });

  it("in HTML, drops someone else's mailto or tel link whole, keeps the show's", () => {
    expect(
      redactContactsHtml(
        '<p>Host: <a href="mailto:host@example.org?subject=Hi">email her</a>, ' +
          '<a href="tel:+14175550146">call</a>, ' +
          '<a href="mailto:canarycryradio@gmail.com ">the show</a></p>',
      ),
    ).toBe(
      `<p>Host: ${CONTACT_REMOVED}, ${CONTACT_REMOVED}, <a href="mailto:canarycryradio@gmail.com ">the show</a></p>`,
    );
  });

  it("is applied to show notes", () => {
    const notes = sanitizeNotes(
      '<p>Art by a producer: <a href="mailto:artist@gmail.com">artist@gmail.com</a> · 417-555-0146</p>',
    );
    expect(notes).not.toContain("artist@");
    expect(notes).not.toContain("555-0146");
    expect(notes).toContain(CONTACT_REMOVED);
  });
});
