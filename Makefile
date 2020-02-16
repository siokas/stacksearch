run:
	deno --allow-net mod.ts -q="typescript error"

build:
	deno bundle mod.ts dist/main.bundle.js

bundle: 
	deno bundle mod.ts dist/main.bundle.js

fmt:
	deno fmt *.ts ./src/*.ts

format:
	deno fmt *.ts ./src/*.ts