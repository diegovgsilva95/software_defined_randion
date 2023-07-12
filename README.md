# Purpose
The purpose of this project is to use a RTL-SDR (Software Defined Radio) in order to receive and determine statistical distribution of samples (Bell's curve).

Author: Diego Silva

# Involved technologies
The following technologies are involved: 
- A RTL-SDR dongle
- `rtl_fm` software
- Node.js, HTTPS library and the following NPM libraries:
    - [ws](https://www.npmjs.com/package/ws): a minimalist WebSocket Server implementation
    - [dotenv](https://www.npmjs.com/package/dotenv): a `.env` config file bootstraper
    - [express](https://www.npmjs.com/package/express): a route-based Web Service
- Browser's Javascript:
    - Canvas (`HTMLCanvasElement`) and Canvas Drawing Context (`CanvasRenderingContext2D`) 
    - `EventTarget` to implement a `EventEmitter`-alike class.
    - Native WebSocket client (`WebSocket`)

# Setting up
Create a new `.env` file containing the following:


```sh
HTTPS_CERT_FILE="path/to/your/public_cert.crt"
HTTPS_KEY_FILE="/path/to/your/private_cert.key"
```

In development environment, you can generate a self-signed certificate using `openssl` or other specialized tools. 

Run with `node index.mjs`.

To exit, use `Ctrl+C`. Make sure `rtl_fm` is dead after that, using `top`, `ps -aux` or other process monitoring tool. 

