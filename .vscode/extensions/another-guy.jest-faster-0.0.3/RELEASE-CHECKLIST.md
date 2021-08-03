# Release Checklist

- [ ] Check if `README.md` needs to be updated:
  - [ ] Any text in any section?
  - [ ] Supporting images or GIFs?
- [ ] Update version in `package.json` according to SemVer rules.
- [ ] Make sure `keywords` section in `package.json` is up-to-date.
- [ ] Update `CHANGELOG.md`:
  - [ ] Mention all changes according to "Keep a Change Log".
  - [ ] Set a release date.
- [ ] Release the package!
  - [ ] Create a git commit.
  - [ ] Mark commit with a tag.
  - [ ] `vsce package`
  - [ ] `vsce publish`
