# Changelog

## [Unreleased]
### Changed
- [#60] Adds layout optimizations for mobile devices.
- [#105] Fixes an issue which prevented the address book download button to work on Firefox.
- [#101] Fixes the reset button of the payment dialog to reset the validity and input values correctly.
- [#5] Changes numeric amounts to be displayed in decimal notation

### Added
- [#94] Adds withdraw functionality.
- [#79] Adds ens resolution support.
- [#85] Adds account's eth balance on the header.
- [#49] Adds error screen for JSON RPC connection failure.
- [#33] Exposes environment and chain information.
- [#103] Adds instant validation feedback on input fields.
- [#15] Adds a button to the header linking to a faucet on testnets.
- [#11] Adds a token mint button for testnets

## [0.8.0] - 2019-01-25
### Changed
- [#66] Fixes an issue where token information would fail to load.
- [#8] Fixes truncation of long token network names.
- [#55] WebUI does not show notification when user opens their first channel.
- [#43] Changes the layout in tokens/channels to make only the entries scrollable.

### Added
- [#31] Add a general `Send Token` button in the channels page.
- [#13] Adds an `Add Funds` button to the Token Card that allows to add funds to the connection manager after joining a 
token network.
- [#34] Adds an address book functionality.

## [0.7.1] - 2019-01-11
### Changed
- [#48] WebUI fails to load on Firefox with Parity due to CORS errors.

## [0.7.0] - 2019-01-04
### Changed
- [#44] Fixes an issue with the types in `TokenInfoRetriever` that would cause issue on amount input.
- [#41] WebUI should allow you to open a channel without any balance.
- [#37] Remove debug events from the WebUI.
- [#9] Optimize the WebUI to handle a great number of tokens.

## [0.6.0] - 2018-12-05
### Changed
- First python package release.

[Unreleased]: https://github.com/raiden-network/webui/compare/v0.8.0...HEAD
[0.8.0]: https://github.com/raiden-network/webui/compare/v0.7.1...v0.8.0
[0.7.1]: https://github.com/raiden-network/webui/compare/v0.7.0...v0.7.1
[0.7.0]: https://github.com/raiden-network/webui/compare/v0.6.0...v0.7.0
[0.6.0]: https://github.com/raiden-network/webui/releases/tag/v0.6.0

[#105]: https://github.com/raiden-network/webui/issues/105
[#103]: https://github.com/raiden-network/webui/issues/103
[#101]: https://github.com/raiden-network/webui/issues/101
[#94]: https://github.com/raiden-network/webui/issues/94
[#85]: https://github.com/raiden-network/webui/issues/85
[#79]: https://github.com/raiden-network/webui/issues/79
[#66]: https://github.com/raiden-network/webui/issues/66
[#60]: https://github.com/raiden-network/webui/issues/60
[#55]: https://github.com/raiden-network/webui/issues/55
[#49]: https://github.com/raiden-network/webui/issues/49
[#48]: https://github.com/raiden-network/webui/issues/48
[#44]: https://github.com/raiden-network/webui/issues/44
[#43]: https://github.com/raiden-network/webui/issues/43
[#41]: https://github.com/raiden-network/webui/issues/41
[#37]: https://github.com/raiden-network/webui/issues/37
[#34]: https://github.com/raiden-network/webui/issues/34
[#33]: https://github.com/raiden-network/webui/issues/33
[#31]: https://github.com/raiden-network/webui/issues/31
[#15]: https://github.com/raiden-network/webui/issues/15
[#13]: https://github.com/raiden-network/webui/issues/13
[#11]: https://github.com/raiden-network/webui/issues/11
[#9]: https://github.com/raiden-network/webui/issues/9
[#8]: https://github.com/raiden-network/webui/issues/8
[#5]: https://github.com/raiden-network/webui/issues/5
