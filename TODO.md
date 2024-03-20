# Bugs

- going from someone's page to the donations page via footer's link - doesn't go

# Improvements

## Security

- see if we can improve firebase rules: allow write for authed user only for his/her own documents (crypto pages)
- expire & delete incomplete accounts (passwordless) that haven't completed registration
- clear verif_code and pass_reset_code flds in db when no longer needed
- encrypt passwords/emails locally in the browser before handoff to php
- request email verification code entry when changing account email address

## Accessibility

- disable tabbing when sorting cryptos
- after deleting a crypto with keyboard, focus somewhere near the deleted crypto
- have an option in the SR hint about sorting on `<Cryptos>` to not show this alert again

## UX

- be able to edit a crypto's name/code
- be able to save a draft page from `<UserPages>`
- have a "Send again" btn for confirmation code emails
- when editing a `<Cryptos>` page, have the page title and url edit flds available in the site header
- Add Drag-n-Drop functionality for `<UserPages>` like in `<SortableCryptos>`
- add hrefs to all navigational buttons/links to allow middle-clicking to open in new tabs

## Design

- site logo
- use svg crypto icons on a `<UserPage>`
- trim-crop away the transparency around png crypto logos (some CoinGecko logos have empty space around them)
- prettier emails

## SEO

- add and dynamically update `<meta>` tags & the structured data
- make all modals URL reachable

## Animation

- when closing a modal, don't change any of its contents until the fadeout is complete (use onExited for stuff that
  visually changes contents)
- stop the slow fade-outs of outline (or box-shadow) when stopping to hover/focus over hover-ables/focus-ables
- achieve fade for `<Crypto>` address fld placeholder in the `<AddCryptoForm>` when turning the light on/off
- add transitions/animations to everything
- animate flipping a crypto card when opening it

## General

- don't have a modal inside each `<Crypto>` but have just 1 modal that's populated with a clicked crypto's info
  causes visual changes to contents)
- try to get rid of refs in `<Crypto>`
- see if we can use Bootstrap's built-in light/dark settings rather than own

# New features

- be able to add a public view address (e.g. for XMR)
- be able to add custom logos to user pages
- be able to add custom crypto logos
- add user page analytics
- allow embedding cryptos in an iframe / provide hardcode
- make footer collapsible, and after it does have a little info icon/btn in its place
- have a section with the page owner's name/info/avatar/links
- categories on pages

# Test

- screen readers
- diff mobile browsers
- old browsers
