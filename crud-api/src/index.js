import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { stream, streamText, streamSSE } from 'hono/streaming'
import { v4 as uuidv4 } from 'uuid'

const app = new Hono()

const videos = [
  {
    "name": "Kamal Qadir",
    "language": "Sindhi",
    "id": "V59OF92YF627HFY0",
    "bio": "Donec lobortis eleifend condimentum."
  },
  {
    "name": "Akash Yadav",
    "language": "Hindi",
    "id": "F2KEU5L7EHYSYFTT",
    "bio": "Duis commodo orci ut dolor iaculis facilisis."
  }];
app.get('/', (c) => {
  //console.log(c.req)
  return c.html('<h1>Hello World!</h1>');
})
app.post('/video', async(c) => {
  const {name, language, bio} = await c.req.json();
  const newVideo = {name, language, id: uuidv4(4), bio};
  videos.push(newVideo);
  return c.json(newVideo);
  })

app.get('/videos', (c) => {
  if(videos.length === 0){
    return c.json({message: 'No videos Available'}, 200)
  }
  return streamText(c, async (stream) => {
    // Write a text with a new line ('\n').
    for(const video of videos){
      await stream.writeln(JSON.stringify(video))
      // Wait 1 second.
      await stream.sleep(10)
    }
  })
})

app.get('/video/:id', (c) => {
  const id = c.req.param('id')
  const video = videos.find(v => v.id === id)
  if(!video){
    return c.json(({error: 'Video not found'}), 404)
  }
  return c.json(video)
})

app.put('/video/:id', async (c) => {
  const id = c.req.param('id')
  const video = videos.find(v => v.id === id)
  if(!video){
    return c.json(({error: 'Video not found'}), 404)
  }
  const {name, language, bio} = await c.req.json();
  video.name = name;
  video.language = language;
  video.bio = bio;
  return c.json(video)
})

app.delete('/video/:id', (c) => {
  const id = c.req.param('id')
  const index = videos.findIndex(v => v.id === id)
  if(index === -1){
    return c.json(({error: 'Video not found'}), 404)
  }
  videos.splice(index, 1)
  return c.json(({message: 'Video deleted'}))
})

app.delete('/videos', (c) => {
  videos.length = 0;
  return c.json(({message: 'All videos deleted'}))
})


const port = 3000
console.log(`Server is running on port ${port}`)
serve({
  fetch: app.fetch,
  port
})
