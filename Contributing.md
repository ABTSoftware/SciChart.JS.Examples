# Contribution Guide

## PULL REQUEST(PR) GUIDE GUIDE 🚀

Before making a PR, make sure that a PR contains only a single (☝️) feature, fix etc - make that unrelated bug-fix (🔨) a different PR, please! A PR can have multiple commits, but divide them logically - no random commits! And while making commits, do remember to follow the commit message guide right below this. If you have several commits in your PR it might be worth to squash them. 

For example if you need to squash 2 commits `rebase -i HEAD~2`, pick first commit and squash second.

## Commit Message Guide ✉️

Each commit message should include a **type**, a **scope** and a **subject**:

```
 <type>(<scope>): <subject>
```

Lines should not exceed 100 characters. This allows the message to be easier to read on github as well as in various git tools and produces a nice, neat commit log.

e.g:

```
 feat(examples): add candlestick chart
 fix(*): scichart intercepting all keyboard events
 docs(*): add contribution guide
 refactor(examples): server side rendering
```

### Type

Must be one of the following:

- **feat**: A new feature 👍
- **fix**: A bug fix 🔨
- **docs**: Documentation only changes 📖
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc) 💅
- **refactor**: A code change that neither fixes a bug or adds a feature 🔧
- **test**: Adding missing tests ✔️
- **chore**: Changes to the build process or auxiliary tools and libraries such as documentation generation 😵

#### Scope

The scope could be anything specifying place of the commit change. For example `examples`, `sandbox`, `tutorials`, `*` (all) etc...
