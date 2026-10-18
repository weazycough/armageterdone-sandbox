[canary-cry-website-issues.md](https://github.com/user-attachments/files/33614638/canary-cry-website-issues.md)
# Canary Cry Website: Issues from Beta Feedback

Source: tester feedback from Tracie, with Stefan's responses, refined into the issues below.

## Instructions for Claude Code

1. Create these labels in the repo if they don't already exist:
   `enhancement`, `design`, `content`, `backend`, `needs-discussion`, `epic`, `security`
2. Create the issues below in order (#1 through #15). Use each `###` heading as the issue title, without the number, and everything under it as the body.
3. Cross-references in this file (e.g., "#5") use this file's numbering. If the repo already has issues, the GitHub numbers will be different. After creating all the issues, update each body so the references point to the correct GitHub issue numbers.
4. Report back with a table mapping this file's numbers to the new GitHub issue numbers and links.

---

### 1. Redesign the landing page around the mission
**Labels:** `enhancement` `design` `content`

The current home page drops visitors straight into the latest episode. Newcomers feel like they've walked into a conversation already in progress. The hero should explain what Canary Cry is first, and still give returning listeners a quick route to the newest episode.

- **Hero title:** CANARY CRY, in canary yellow
- **Subtitle:** Canary Cry Radio | Canary Cry News Talk
- **Tagline:** Think Outside the Cage.
- Hero visual, such as a canary breaking free of a cage
- Move the current one-paragraph About text here
- Keep a visible "Latest episode" link for existing listeners

**Notes:**
- Consider putting "A biblical take on the news and world events" in the About paragraph below the hero.
- Check that the canary yellow is readable against the hero background. Yellow text on a light background usually doesn't have enough contrast.
- The final logo (#2) may change this layout later.

---

### 2. Define one consistent logo for site and promo materials
**Labels:** `design` `needs-discussion`

The site, marketing, and promo materials should all use one logo that doesn't change. This doesn't block other work; the logo can be added later. Once it's final, though, it may change the layout of the hero and headings in #1, so revisit those then.

Stefan's open question: what is the logo, and can it be introduced on this site?

---

### 3. Bolster the About section
**Labels:** `enhancement` `content` `needs-discussion`

**Discussion:** Should About stay one page, or be split into a high-level **About** page and a separate **Legendarium of the Canarium** page? For now, build it as two pages, both listed in the **About** dropdown.

#### Page 1: About

**About the Show**

> The Canary Cry Network includes two main streams.
>
> **Canary Cry News Talk** is the flagship show: a biblical take on the news and world events. It's light on the politics and focuses on seeing behind the hyperbolic headlines to what's really going on, so listeners can think outside the cage. CCNT streams live every Monday and Wednesday, starting around 3:00 PM Pacific.
>
> **Canary Cry Radio** features long-form interviews with theologians, podcasters, influencers, discerners, and researchers. CCR episodes are prerecorded and released as they become available, usually about every other week.
>
> **Plus, for the community: Canary Cry Clubhouse** is a live producer call-in show hosted by Basil every Thursday around 2:00 PM Pacific. Each show opens with a monologue from Basil, followed by call-ins from the audience and producers to discuss whatever's on their mind, or where the Holy Spirit leads them.
>
> Every show looks at the world through a biblical lens of truth, with an emphasis on prophecy, spiritual biblical phenomena, and what some might call fringe Christianity. For almost two decades, long before these topics went mainstream, the hosts have been discussing the Nephilim, angels and demons, and other supernatural phenomena in what some are calling the "age of enchantment."

**About the Co-Hosts**

High-level overview, plus some in-depth history, of how each host came to this ministry.

- **Gonz:**
  - Author of the upcoming book *Prophecy Without Panic*
  - Writer and director of the *Age of Deceit* film series
  - **Links:** [Prophecy Without Panic](https://www.patreon.com/834979/join) · *Age of Deceit* [I](https://www.imdb.com/title/tt2721740/), [II](https://www.imdb.com/title/tt3531808/), III, IV
    - III and IV are plain text with no links.
- **Basil:**
  - Off-the-grid hermit living in an undisclosed location
  - Emu rancher
  - Wears a VR headset that helps him produce the show and hides his identity
  - Host of **The Joyspiracy Theory** podcast: https://www.thejoyspiracytheory.com/
  - Takes part in a yearly ministry at **Burning Man** with the Camp of the Unknown God, researching the technocratic agenda being deliberately presented to attendees: http://burningmanresearch.com/

#### Page 2: Legendarium of the Canarium

**Introduction: the Canary Cry story**

A one-page detailed history covering:
- How the co-hosts met
- Where Canary Cry started
- Key dates
- How the show has changed over the years
- Where it is today

*Research needed: someone has to gather this history and write it up.*

**Two-column section**

| Left: Historical Episodes of Monumental Importance | Right: Where We Are Today |
|---|---|
| **CCNT:** link to a YouTube playlist of 6–10 foundational episodes | **CCNT:** link to the current show |
| **CCR:** link to a YouTube playlist of 6–10 foundational episodes | **CCR:** link to the current show |
| *For now, link one recommended foundational video for each until the playlists are built* | |

**HISTORICAL DATES timeline**

- A vertical timeline runs down the center of the page.
- Events alternate between the left and right sides as the visitor scrolls.
- Each event shows its **date** and a **heading** (e.g., "Basil and Gonz meet at church," "First episode airs").
- Hovering over an event reveals a paragraph with more detail, plus links where relevant: a podcast episode, a film, a book, or another product.
- It starts at the earliest key moment (when Basil and Gonz met, or the original show) and ends with the latest episodes.

**To do:**
- Research and write the history and timeline entries
- Pick the 6–10 foundational episodes for each playlist
- Build the YouTube playlists

**Build notes:**
- **Mobile:** phones don't support hover, so events should expand on tap. On narrow screens, the timeline should become a single column with all events on one side.
- **Timeline data:** storing events in a simple data file (date, heading, description, links) lets anyone add entries without editing the page layout.

---

### 4. Link callbacks to past episodes
**Labels:** `enhancement` `needs-discussion`

Basil and Gonz often refer back to earlier episodes on air. When that happens, the referenced episode should be linked from the new episode's page, the show notes, and possibly the video description. The open question is where these links should appear and how listeners find them.

---

### 5. Transcript search page
**Labels:** `enhancement` `backend`

- Index the transcripts of all past shows
- Search results link straight to the matching show, with separate audio and video links
- Bonus: jump to the timestamp where the term comes up

---

### 6. Topic / keyword index
**Labels:** `enhancement` `backend`

This was Max's idea. A visitor picks a topic (Antarctica, Nephilim, porcupines, and so on) and gets every episode that covers it, ideally linked to the point just before the discussion starts. It should probably be built on top of #5.

The topic tags should be the same tags used by the show search in #8, so the tagging work is only done once.

---

### 7. Foundational knowledge hub ("CC University")
**Labels:** `epic` `content`

A section for newcomers with:
- Definitions
- People, places, and world events, linked to articles
- Book recommendations
- Key interviews
- Cross-references to episodes (using #4 to #6)

Several listeners besides Tracie and Stefan have asked for this.

---

### 8. Shows page: show list and show pages
**Labels:** `enhancement` `design` `backend`

Clicking the **Shows** tab opens a landing page. The **Shows** dropdown menu stays as it is.

#### Show list (below the news desk graphic in #9)

Each show gets:
- **Show name**, which links to that show's own page
- Video graphic links to its **last three episodes**
- The description of each episode, pulled from the show's RSS feed
- An **All Episodes** link to the show's page

#### Individual show pages

- **Search field** at the top
- The latest **10 episodes**, each shown as a video graphic box with the episode title
- Pagination at the bottom: **Page 1 of X**, running through to the oldest episodes
- A **List of All Episodes** link below the pagination

#### List of All Episodes page (one per show)

- **Search field** at the top
- A clean list running from newest to oldest
- The episode name links to the embedded player. It expands in place and has a full-screen option.
- No descriptions
- Platform logos on each row, each linking to that episode on that platform: Spotify, Apple, Amazon, iHeart, Castbox, Overcast, YouTube, Rumble, RSS
- **Sort** by any column (A–Z and Z–A)

**Columns by show:**

| Show | Columns |
|---|---|
| Canary Cry News Talk | Episode # \| Episode Date \| Episode Name |
| Canary Cry Clubhouse | Episode # \| Episode Date \| Episode Name |
| Canary Cry Radio | Episode # \| Episode Date \| Episode Name \| **Guest(s)** |

**Guest links (CCR):** clicking a guest's name opens a list of every episode with that guest, in the same list format.

#### Search (show pages and All Episodes pages)

- Search by **episode number, title, guest, or topic**
- Topics come from the show notes for now. Topics will need to be tagged on each episode where the show notes don't already describe them.

#### Site-wide video and player rules

- Every video graphic link on the site plays the episode from the RSS feed in an embedded player on the site.
- Under every video graphic link, include a small **LISTEN ON:** row with platform logos (Spotify, Apple, Amazon, iHeart, Castbox, etc.). Each logo links to that episode on that platform.

#### Build notes

- **Platform episode links:** RSS feeds don't include each platform's episode URL. Spotify, Apple, and YouTube links can be fetched automatically through their APIs. Amazon, iHeart, and Castbox are harder to look up per episode, so they may need to link to the show's page on that platform instead.
- **List size:** a list of about 1,000 CCNT episodes is fine as plain text. With 9 logos per row, though, that's about 9,000 icons on one page, so use a lightweight SVG icon set and load the logos lazily.
- **Audio vs. video:** if a feed's media is audio only, the "video graphic" should play the audio with the episode artwork. Video playback would come from YouTube or Rumble.
- **Logos:** use each platform's official "Listen on" badge or logo and follow its brand guidelines.
- **RSS descriptions** often contain HTML, so clean it up before displaying.
- **Guest data:** many CCR titles already include the guest's name (e.g., "…with Mary Tocco"), so a first pass of the Guest(s) column can be pulled from titles automatically. Someone will still need to review it for episodes with several guests, nicknames, or a guest who isn't named in the title.
- **Shared tags:** topic tags here should be the same ones that power the topic index (#6). Once transcript search (#5) exists, it can feed this search too.
- **Other shows:** check whether The Joyspiracy Theory, Burning Man Research, and Basil's Bunker have RSS feeds and should get full show pages, or whether they should link out to their own sites.

---

### 9. Shows page: news desk graphic
**Labels:** `enhancement` `design`

Put this at the top of the Shows landing page.

- Basil and Gonz at a news desk, surrounded by monitors
- Clickable monitors that link to each show:
  - Canary Cry News Talk
  - Canary Cry Radio
  - Canary Cry Clubhouse
  - The Joyspiracy Theory
  - Burning Man Research
  - Basil's Bunker

**Future feature:** a 24/7 livestream of Canarium episodes, on hold for now.

---

### 10. Contact tab
**Labels:** `enhancement` `design` `needs-discussion`

Contact gets its own top-level tab, separate from About. Stefan wanted Contact easy to find and not hidden under About. Tracie wanted it to be a place for engagement, including prayer requests.

#### Proposed dropdown
- **Contact Us**
- **Prayer Request** (#11)
- **Suggest a Guest / Be a Guest**
- **Website Issue or Enhancement Request**

#### Contact Us page

**Contact form**
- Fields: name, email, subject, message
- A **Reason for contacting** dropdown that routes each message to the right inbox:
  - General question or feedback
  - Show tip or news story
  - Guest suggestion or booking
  - Meetup inquiry (host or attend)
  - Media or press
  - Producer or donation question
  - Website issue or enhancement request
- Spam protection (see #14)
- A confirmation message after sending, such as "Thanks! Your message is on its way."

**Other ways to connect**
- Social media links with logos
- "Listen on" platform links
- A link to the donation/producer page
- A link to the Community page (#12) for meetups

#### Routing

| Category | Sent to |
|---|---|
| Website issue or enhancement request (form option and dropdown page) | canarycrytechteam@gmail.com |
| Everything else | canarycryradio@gmail.com |

The addresses go only in the form's backend settings, never in the page itself (see #14).

#### Suggest a Guest / Be a Guest page
- Fields: guest name, topic, why they'd be a good fit, contact or website link, and whether the person is suggesting someone else or pitching themselves
- Feeds into CCR booking

#### Website Issue or Enhancement Request page
- Fields: page URL, issue or idea, device and browser, optional screenshot
- Messages go to canarycrytechteam@gmail.com and can later feed the GitHub issue tracker.

#### Needs discussion
- Which categories to keep
- Whether to include a mailing address or P.O. box for mail and gifts

---

### 11. Prayer request form
**Labels:** `enhancement` `backend`

- Option to submit anonymously
- Spam protection (see #14)
- Optional link to the donations page

**Considerations:**
- **Data handling:** these submissions can be very personal. Decide who can read them, where they're stored, and whether they get deleted after a while. Don't log IP addresses on anonymous submissions.
- **Donation link wording:** a donation link next to the prayer form could read as paying for prayer. Tracie specifically said she wants the form to feel low-pressure. Present the link as a separate, optional way to support the show.

---

### 12. Community page: map and meetup posters
**Labels:** `enhancement` `design`

- Map showing where producers live (taken from Canary Cry text area codes) and where meetups have been held
- Archive of past meetup posters and artwork
- Upcoming meetup posters

**Consideration:** plotting producers by area code shows where people live. Keep the map coarse, at the region or state level, rather than plotting individual points. Consider making it opt-in.

---

### 13. SEO
**Labels:** `enhancement` `backend`

- **Redirects:** add 301 redirects from the old site's URLs to the new pages so existing links and search rankings carry over. This is the most important task for a rebuild.
- **Page basics:** a unique title and meta description for every page, plus clean, readable URLs for each show and episode.
- **Social sharing:** Open Graph and Twitter/X card tags so links show a proper image and description on social media and in texts.
- **Structured data:** schema markup for the podcast series, episodes, videos, and organization, so search results can show richer listings.
- **Sitemap and robots.txt:** generate a sitemap.xml automatically as new episodes are added.
- **Search Console:** register the site with Google Search Console and Bing Webmaster Tools, and submit the sitemap.
- **Images:** add alt text to every image, including the news desk monitors and show artwork.
- **Performance:** keep page loads fast and mobile-friendly, since search engines rank on this.
- **Transcripts:** publishing episode transcripts (#5) as indexable text is one of the biggest SEO wins available for a podcast.

---

### 14. Spam protection
**Labels:** `enhancement` `backend` `security`

#### Email masking
- Keep raw email addresses out of the page's HTML. Use contact forms wherever possible (#10).
- Where an address has to be shown, mask it. Options include JavaScript that builds the address on page load, encoded `mailto:` links, or displaying it as "team [at] canarycry [dot] com."
- **Timing:** can be done when the team moves from the Gmail addresses to **@canarycry.com** addresses.

#### Form protection (applies to #10 and #11)
- CAPTCHA on every form. Cloudflare Turnstile or hCaptcha are less intrusive than the classic "click the traffic lights" style.
- A hidden honeypot field that bots fill in and people never see
- Rate limiting, so one source can't submit dozens of messages in a row
- Basic content filtering for links and known spam phrases

#### When moving to @canarycry.com
- Set up **SPF, DKIM, and DMARC** records for the domain, so other servers can't easily send spoofed email pretending to be Canary Cry and so form notifications don't land in spam folders.
- Update form routing in #10 to the new addresses.

---

### 15. Correct the Producer and Executive Producership info
**Labels:** `content` `needs-discussion`

Update the producership section on the **Support** tab. Rename the section heading to **Producer & Executive Producership**.

**Proposed copy (pending verification):**

> **Producer:** Anyone who supports an episode with **$7.77 to $99.99** is credited as a Producer. Your name will be mentioned on the show, and your accompanying note may be read.
>
> **Executive Producer:** Anyone who supports an episode with **$100 or more** is credited as an Executive Producer, not just the top contributor. Your name and accompanying note will be read on the show.
>
> Producers who have reached Knight or Dame status may get special consideration for having their notes read.
>
> **Donations in round numbers are treated as anonymous, and your name won't be read on the show. For example: $10.00, $25.00, $75.00, $100.00. If you'd like your name and amount shared, make it a fun number, like $7.77, $33.33, $100.33, or $1,234.56.**
>
> Thank you for your support!

**Verification notes:**
- The current Support page gives the Associate Executive Producer title to anyone giving $100+ for an episode, and the Executive Producer title only to the single top supporter over $100. Recent CCNT show notes list several Executive Producers per episode, which matches the new rule.
- The current page says notes are read for producerships above $7.77. The new copy says names are mentioned at $7.77 and notes may be read. Pick one.
- The round-number anonymity rule isn't on the current page. Confirm it with the hosts.
- Amounts under $7.77 aren't covered. Decide whether those supporters get any credit.

**Before publishing:** Basil and Gonz should confirm the titles, the dollar ranges, the note-reading rules, the Knight/Dame consideration, and the round-number rule.

---

## Open items for the call

Issues needing decisions: #2, #3, #4, #10, #15.
