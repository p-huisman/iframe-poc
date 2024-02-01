# `<p-component>` element

Test keys 1024

-----BEGIN RSA PRIVATE KEY-----
MIICXAIBAAKBgH115JfDEMa3OW7bQMwY80M6jzm8I1Si+1NNeagnbbVTXP/MQ9eA
N/OK+Ah5Wzv2kQgARMfSMbPlOsO3kY+Zks7gSTtT8aTxGcKIEjYsR/lTof3iBDEw
HvRpcF2iNjwzSawZTVu5e/cyhnDDrlur+MhMgPMmYCtYFFtnpbDkMZBpAgMBAAEC
gYA+LJSSWQsRT2/Y7jMYcizr3jNoa0IfCX3/dF+b455Mw/lMkw/z1gjkWrQ8jteV
ycVp76gmVpZnDmym3Wv3fCXyRXPWSq3EpCzygZLprWfQsDTOlH8ABcWAs8Oga94W
cvNHjGzWZNM+SzAyuz/kxy8GuaBRpAcBdDlChfqdkJ+NAQJBAOHNw+4WpkCX/i2u
i+mjIFfk+DsHK4yussdiP/vKo79EoKMPX1MukNWjBW2IeReKXtS7uMHDkKVLKkV6
OecOhFkCQQCOPPJDMFVlD6h2J7v6JZyGuOrHf4RAwaELsMnViVMs/Kd0QLTtC2aY
jZ0X+8spN+Yk73eOfjLZCm905JtdEiqRAkEAg2UxNkKHy96mUf7X+8So9XyP1gl+
FgcykUNi6CoqzwooT7qKReU68pZCelKH5GLoe/IguOAMM6NhnbxaJVIVQQJASHAB
cPZMhwtSX9ocgWhmLrY92xu13sS9n5aJM5acJW0GWs4ZVh9YQJjeSDiTXop5SpYp
7QeYHbCS0pUaCmwWAQJBAMio6f596eC4aQfoCdrQGpRuXF8VAu+FH1qpUFSXKd9+
5M+4bVe9VG4F/evrT3ChB9XxUENFIzRYtHxIawrG0t8=
-----END RSA PRIVATE KEY-----

-----BEGIN PUBLIC KEY-----
MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgH115JfDEMa3OW7bQMwY80M6jzm8
I1Si+1NNeagnbbVTXP/MQ9eAN/OK+Ah5Wzv2kQgARMfSMbPlOsO3kY+Zks7gSTtT
8aTxGcKIEjYsR/lTof3iBDEwHvRpcF2iNjwzSawZTVu5e/cyhnDDrlur+MhMgPMm
YCtYFFtnpbDkMZBpAgMBAAE=
-----END PUBLIC KEY-----

## About he boilerplate

Boilerplate for creating a custom p-elements using esbuild

This boilerplate includes:

- [esbuild](https://esbuild.github.io/) for transpiling and bundeling typescript to javascript
- [typescript](https://www.typescriptlang.org/) for generating typings
- [postcss](https://postcss.org/) for css pre processing
- [karma](https://karma-runner.github.io/) Test runner
- [jasmine](https://jasmine.github.io/) Test framework
- [husky](https://typicode.github.io/husky/) git hooks made easy, lint staged files before commit
- [eslint](https://eslint.org/) linting
- [prettier](https://prettier.io/) code formatter (eslint plugin)
- [sonarjs](https://github.com/SonarSource/eslint-plugin-sonarjs) typescript analyzer (eslint plugin)
- [express](https://expressjs.com/) local development web server

## Getting started with this boilerplate

- Rename the tagName value `p-component` in the `CustomElementConfig` decorator.
- Rename the class name `PComponentElement` to the desired name. Tip: use F2 in visual studio code.
- Rename the component source file `src/p-component.tsx` to the name of your custom element.
- Rename the component test source file `src/p-component.spec.tsx` to the name of your custom element.
- Rename the component stylesheet `src/p-component.css` to the name of your custom element.
- Edit the `name`, `repository` and `types` properties in the `package.json` file to match your component.
- In the build file `scripts/build.js` change the value `src/p-component.tsx` of constant `buildOptions.entryPoints` to the match your component source file.
- Change the script src and `<p-component name="World"></p-component>` markup in `demo/index.html` so your component script loads correct.

## Attributes

| Name | Description       |
| ---- | ----------------- |
| name | a name e.g. Peter |

## Properties

| Name | Description       | Type   |
| ---- | ----------------- | ------ |
| name | a name e.g. Peter | string |

## Events

| Name | Description |
| ---- | ----------- |
|      |             |

## Install npm packages

```
npm install
```

## Build

```
npm run build
```

## Develop

```
npm run develop
```

## Test

```
npm test
```

## Before submitting changes

lint

```
npm run lint
```
