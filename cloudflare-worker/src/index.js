import { Hono } from 'hono'
import { html, raw } from 'hono/html'

const app = new Hono()

app.get('/', (c) => {
  return c.html(
    <html>
      <head>
        <title>Shivang Gupta</title>
      </head>
      <style>
        {raw`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
           h1{
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            width: 100vw;
            color: #f1f1f1;
            font-family: Arial, sans-serif;
            background-color: #313131;
          }
        `}
      </style>
      <body>
        <h1>Hello, I am Shivang Gupta a 100xdev.</h1>
      </body>
    </html>
  )
})

export default app
