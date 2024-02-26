# `<p-iframe-fetch>` element

This web component installs a service worker.
Until the service worker is loaded all fetch requests are added to a queue.
When the service worker is ready the requests from the queue are executed.

The service worker intercepts fetch requests.
If a fetch URL matches the configured pattern, the service worker will get a token from the configured token-url. The token will be added to the `x-remote-fetch-token` request header. The service worker post a requests the web component to execute the request within an iframe. The result of the request is returned to the service worker.
The fetch interceptor returns a response object

## Example

see `/demo/index.html` and `/scripts/data-server.js`

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

## Attributes

| Name           | Description                                                                       |
| -------------- | --------------------------------------------------------------------------------- |
| service-worker | the src for the service worker eg `/dist/iframe-fetch-service-worker.js`          |
| token-url      | the url token endpoint                                                            |
| pattern        | if a fetch request url match this pattern the fetch request is done in the iframe |

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
