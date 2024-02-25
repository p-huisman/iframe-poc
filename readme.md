# `<p-data-channel>` element

`npm i`

`npm run develop`
Er starten 2 web servers op:

1. localhost poort 9000 (scripts/build.js + scripts/api/index.js)

Dit is de mijnomgeving de demo url = `http://localhost:9000`
deze omgeving heeft een token end point `http://localhost:9000/token`, dit end point geeft een versleuteld json object terug `{bsn: "1234567890" }'

De demo pagina doet een request via een iframe en stuurt een header met dit token mee.

2. localhost poort 9001 (scripts/data-server.js)

Dit is waar de data wordt opgevraagd, in deze demo verloopt de communicatie via een iframe
de url van de iframe = `http://localhost:9001/data-channel` het document in de iframe communiceert met het document waarin de iframe staat via [MessageChannel](https://developer.mozilla.org/en-US/docs/Web/API/MessageChannel)

De demo pagina op `http://localhost:9000/demo` doet een request via het iframe naar `http://localhost:9001/data-sample-request` dit end point geeft als resultaat

```
{
  "message" : "Hello 1234567890" /* 1234567890 = bsn uit token */
}
```

## Schema

<pre>

                          service                  token     remote-page
page                      worker                  service       iframe              remote-service
|                           |                        |           |                        |
|                           |                        |           |                        |
|                           |                        |           |                        |
|-->-[fetch request]----->---                        |           |                        |
|                           |                        |           |                        |
|                           |->--[get token] ------>-|           |                        |
|                           |                        |           |                        |
|                           |-<--------------------<-|           |                        |
|                           |                        |           |                        |
|<-- post-msg------------<--|                        |           |                        |
|                           |                        |           |                        |
|-->------------post-msg-----------------------------|---------->|                        |
|                           |                        |           |                        |
|                           |                        |           |-->------https--------->-
|                           |                        |           |                        |
|                           |                        |           |                        |
|                           |                        |           |-<----https-----------<-|
|                           |                        |           |                        |
|-<-------------post-msg--------------------------------------<---                        |
|                           |                        |           |                        |
|->-------------post-msg--->|                        |           |                        |
|                           |                        |           |                        |
|-<-[json fetch response]-<-|                        |           |                        |
|                           |                        |           |                        |

</pre>

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
