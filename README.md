# Setup topics & subscriptions required for running cascade message workers

This command is used to setup pubsub topics & subscriptions

## How

### Install

- from sources:

```bash
npm install
npm run build
npm link
```

- using NPM:

```bash
npm install -g @elmy-oss/init-pubsub-cli
```

### Run

- when globally installed
```bash
init-pubsub --env=./example.local.env scripts/initPubSub/config.json
```
- explicit call using `npm` / `npx`
```bash
npx @elmy-oss/init-pubsub-cli ./scripts/initPubSub/config.json
```

## Config

### Environment variables
- `PUBSUB_EMULATOR_HOST`: is the host of the pubsub emulator (edit accordingly when port-forwarding from test envs)
- `PUBSUB_PROJECT_ID`: is the project id of the google pubsub project
- Please note that you have the option to use current shell's environment variables or to utilize an `.env` file. Additionally, you can specify an alternate **dotenv** file by using the `--env=dotenv-file` switch, as demonstrated in the **Run** section above.

### Setup
- Either copy [`example.local.env`](./example.local.env) or [`example.testenv.env`](./example.testenv.env) to `.env` and edit accordingly
- or define environment variables `PUBSUB_EMULATOR_HOST` & `PUBSUB_PROJECT_ID` in your shell before running

Topics & subscription mappings are found in a [config.json](./config.json) file
- an example is provided in [`example-config.json`](./example-config.json).

```json
{
  "topic1-with-single-sub": ["topic1-sub1"],
  "topic2-with-subs": [
    "topic2-sub1",
    "topic2-sub2"
  ],
  "topic3-without-sub": []
}
```