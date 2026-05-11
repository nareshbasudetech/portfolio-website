---
title: 'WhatsApp · Lead Bot'
summary: 'A WhatsApp chatbot that handles inbound lead conversations end-to-end — qualifying, routing, and logging every chat to the CRM.'
role: 'Full-stack · Automation'
discipline: ['Dev', 'Marketing']
year: 2026
accent: '#22c55e'
featured: true
publishedAt: 2026-03-12
---

## The same five questions, fifty times a day

Inbound WhatsApp messages had become a full-time job for the wrong person. Every new lead got the same five questions — *which course, which city, which year, your phone number, when can we call you* — and someone had to sit in WhatsApp Web all day asking them. By the time anyone got around to a serious reply, the lead had already messaged two competitors.

The team had been quietly losing the speed game. Not because the agents were slow, but because the agents were busy doing what a script could do.

## What I built and what I deliberately did not

The brief was a chatbot. The first design decision was: *what kind*.

The trendy answer in 2026 is to throw an LLM at it. Plug GPT into the WhatsApp webhook, prompt it to qualify leads, let it reply in natural language. It works in demos. It also hallucinates course fees. It says "yes we offer that" when we don't. It tells a student in Patna that the campus is in Bangalore. For a top-of-funnel surface where the bot's job is to feel like the brand, that risk was unacceptable.

What I built instead is a *deterministic conversation flow* — closer to a state machine than a language model. The bot has a fixed set of intents it can recognize, a small classifier (running locally, not via an API) that maps incoming messages to those intents, and a hand-curated set of replies. When the user asks something the bot wasn't designed to handle, it doesn't guess — it pings a human and says "they'll be with you in a minute."

The result is a bot that is, by design, less clever than ChatGPT. It is also, by design, predictable, fast, and unembarrassing. For a customer-ops surface that runs at scale, predictable beats clever every time.

## What the conversation actually does

A typical conversation lasts about 90 seconds:

1. **Greet** — friendly opener, mentions what the brand is and what it can help with
2. **Qualify** — pulls the course, city, year, and phone in 3 to 5 messages. Each step has fallback prompts if the user goes off-script
3. **Match** — if the bot has enough to suggest the right next step (a counsellor call, an admissions form, a brochure), it does
4. **Capture** — quietly writes the lead into the CRM with full transcript, source, and a suggested owner
5. **Hand off** — tells the user "a counsellor will reach you by [time]" and pages the appropriate human in the CRM

If the user says something the bot doesn't understand twice in a row — or types something the classifier flags as high-intent (price, refunds, complaints) — the bot stops trying to handle it and routes the conversation to a person. Hand-off is the most important feature.

## What I shipped

- A WhatsApp Business API integration that handles inbound messages with sub-second response times
- A lightweight intent classifier — runs in-process, no third-party API call per message
- A conversational flow editor so non-engineers can change the prompts and add new intents
- Multi-language support for Hindi, English, and Hindi-English code-switched messages (the way Indian users actually type)
- Live human takeover — agents can step in mid-conversation and the bot gracefully steps aside
- Full transcript pipeline into the CRM with source attribution, lead score, and a suggested owner

## Tech notes

- Node + TypeScript on a long-running worker (not serverless — WhatsApp expects fast persistent connections)
- WhatsApp Business Cloud API
- A small intent classifier built on sentence-embedding similarity — runs locally, no per-message LLM cost
- Postgres for conversation state; Redis for the hot session cache
- Webhook → CRM pipeline shared with the lead-management product

## What was harder than it looked

Multi-language code-switching. Indian users type *"course ka fee kya hai"* — half English, half Hindi, transliterated, no punctuation. A monolingual classifier falls over. The fix was building the intent embeddings from real (anonymized) message data and tuning the classifier on the actual language people use, not on dictionary English or dictionary Hindi.

The second hard problem was knowing when *not* to reply. WhatsApp users sometimes type three messages in three seconds. If the bot replies after every single one, it feels robotic and the conversation goes off the rails. We added a small delay window — wait 2 seconds after the last message before replying — that made the bot feel more like a person and less like a vending machine.

## Outcome

<!-- TODO: replace with real metric — current numbers are illustrative -->

The team stopped doing the same five-question qualifier 50 times a day. Leads now get a reply in seconds, not hours. Every conversation lands in the CRM with the context already attached, so whoever picks it up isn't starting from zero. The agent who used to live in WhatsApp Web is now on calls with the leads the bot couldn't fully qualify — the part of the job a person actually adds value on.

## What I'd do differently

I'd put more design effort into the *first* message earlier. The greet copy is what 100% of users see, and we iterated on it five times before settling. If I'd run those iterations in week one instead of week six, we would have hit the higher-converting opener sooner. Top-of-funnel copy is the highest-leverage word real estate in the whole system.
