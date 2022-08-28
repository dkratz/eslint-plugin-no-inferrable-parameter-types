# eslint-plugin-no-inferrable-parameter-types

test

## Installation

You'll first need to install [ESLint](https://eslint.org/):

```sh
npm i eslint --save-dev
```

Next, install `eslint-plugin-no-inferrable-parameter-types`:

```sh
npm install eslint-plugin-no-inferrable-parameter-types --save-dev
```

## Usage

Add `no-inferrable-parameter-types` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
  "plugins": ["no-inferrable-parameter-types"]
}
```

Then configure the rules you want to use under the rules section.

```json
{
  "rules": {
    "no-inferrable-parameter-types/rule-name": "error"
  }
}
```

## Supported Rules

- `no-inferrable-parameter-types`
