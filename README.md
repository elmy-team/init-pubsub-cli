# Setup topics & subscriptions required for running cascade message workers

This script used to setup pubsub topics & subscriptions

## How

```bash
npm run init-pubsub
```

## Config

topics & subscription mappings are found in a [config.json](./config.json) file

Copy an example dotenv file to `.env` or update with your pubSub emulator settings:
- **local** emulator (using `npm run start:local` script) [`example.local.env`](./example.local.env)
- **test-env** pubsub emulator, using k8s port forwarding [`example.testenv.env`](./example.testenv.env) on local port 8432
