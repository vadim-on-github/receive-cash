# Fix bugs

- going from one page of cryptos to anther one via a link or something doesn't update the cryptos; going off of a cryptos page probably doesn't clear the Cryptos state making it flash a previously viewed page of cryptos when going to a new one

# Improve

## Security

- expire & delete incomplete accounts (passwordless) that haven't completed registration
- clear verif_code and pass_reset_code flds in db when no longer needed
- request email verification code entry when changing account email address
- encrypt passwords/emails locally before handoff to server when logging in/singing up

## Accessibility

- disable tabbing when sorting cryptos
- after deleting a crypto with keyboard, focus somewhere near the deleted crypto

## UX

- be able to save a draft page from `<UserPages>`
- have a "Send again" btn for confirmation code emails
- when editing a `<Cryptos>` page, have the page title and url edit flds available in the site header
- Add Drag-n-Drop functionality for `<UserPages>` like in `<SortableCryptos>`
- add hrefs to all navigational buttons/links to allow middle-clicking to open in new tabs
- pasting an email verification code automatically submits the code, no need to press enter or click the button Verify

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

# Implement new features

- be able to allow the public view balances on a page of cryptos (would have to a input public view addresses for XMR/others)
- be able to add custom logos to user pages
- be able to add custom crypto logos
- be able to add custom cryptos and maybe other kinds of currencies to a page
- be able to edit a crypto's name/code making it a custom crypto/other currency on a page
- be able to add multiple same types of cryptos on the same page, diffrentiated by a label/category section/or something
- page analytics (maybe on a user's dashboard)
- allow embedding cryptos in an iframe / provide hardcode
- make footer collapsible, and after it does have a little info icon/btn in its place
- have a section with the page owner's name/info/avatar/links
- categories on pages
- optional tabs for different pages of cryptos viewable when on a page of cryptos
- view the latest pending/confirmed transaction(s) of cryptos on a user's dashboard or on a page of cryptos logged in as the owner of
- view crypto wallet balances on a page of cryptos when logged in as the owner of
