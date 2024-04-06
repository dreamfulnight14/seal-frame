/** @jsxImportSource frog/jsx */

import { Button, Frog } from 'frog'
import { devtools } from 'frog/dev'
import { handle } from 'frog/next'
import { serveStatic } from 'frog/serve-static'
import { kv } from '@vercel/kv';

const app = new Frog({
  assetsPath: '/',
  basePath: '/api',
  imageOptions: { debug: true },
})

app.frame('/', (c) => {
  const { buttonValue: choice, status } = c
  let yesCount = 0, noCount = 0
  if (choice === 'yes') {
    kv.get('yes')
      .then(yes => {
        if (!yes) yesCount = 1
        else yesCount = yes as number + 1
        kv.set('yes', yesCount)
      })
  }
  if (choice === 'no') {
    kv.get('no')
      .then(no => {
        if (!no) noCount = 1
        else noCount = no as number + 1
        kv.set('no', noCount)
      })
  }

  return c.res({
    image: (
      <div
        style={{
          background:
            status === 'response'
              ? 'linear-gradient(to right, #432889, #17101F)'
              : 'black',
          backgroundSize: '100% 100%',
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'nowrap',
          height: '100%',
          width: '100%',
        }}
      >
        <div style={{ color: 'white' }}>Today's Contest is inspired b all you Frement and Harkonnen</div>
        <div style={{ color: 'white' }}>Prize: 1200 $DEGEN</div>
        <div style={{ color: 'white' }}>Deadline: 2/27/24 9 AM PST</div>
      
        <div
          style={{
            alignItems: 'center',
            color: 'white',
            fontSize: 60,
            fontStyle: 'normal',
            letterSpacing: '-0.025em',
            lineHeight: 1.4,
            marginTop: 30,
            padding: '0 120px',
            whiteSpace: 'pre-wrap',
          }}
        >
          {
            choice ? `You already voted ${choice}. Don't you rememeber?` 
            : 'There will be over a 10,000 Kramer predictions before 5/29 midnight'
          }
        </div>
      </div>
    ),
    intents: [
      ...(!choice ? [
        <Button value="yes">Yes</Button>,
        <Button value="no">No</Button>
      ]: []),
      ...(status === 'response' ? [
        <Button.Link href='https://warpcast.com/~/channel/kramer'>Follow Kramer for updates</Button.Link>,
        <Button action='/result'>View Positions</Button>,
      ] : [])
    ],
  })
})

app.frame('/result', (c) => {
  const { status } = c
  let yesCount = 0, noCount = 0
    kv.get('yes')
      .then(yes => {
        yesCount = yes as number
      })
  kv.get('no')
    .then(no => {
      noCount = no as number
    })
  return c.res({
    image: (
      <div
        style={{
          background:
            status === 'response'
              ? 'linear-gradient(to right, #432889, #17101F)'
              : 'black',
          backgroundSize: '100% 100%',
          display: 'flex',
          flexDirection: 'column',
          flexWrap: 'nowrap',
          height: '100%',
          width: '100%',
        }}
      >
        <div
          style={{
            alignItems: 'center',
            color: 'white',
            fontSize: 60,
            fontStyle: 'normal',
            letterSpacing: '-0.025em',
            lineHeight: 1.4,
            marginTop: 30,
            padding: '0 120px',
            whiteSpace: 'pre-wrap',
          }}
        >
          Positions:
          Yes: {yesCount} No: {noCount}
        </div>
      </div>
    ),
    intents: [
      <Button.Link href='https://warpcast.com/~/channel/kramer'>Follow Kramer for updates</Button.Link>,
    ],
  })
})

devtools(app, { serveStatic })

export const GET = handle(app)
export const POST = handle(app)
