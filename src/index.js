import axios from 'axios'
import dotenv from 'dotenv'
import * as duration from 'duration-fns'
import { readJsonFile, sleep } from './utils/index.mjs'

dotenv.config()

const channels = [
  'Rocketseat',
  'Mango',
  'Waldemar Neto - Dev Lab',
  'CodarMe',
  'DevPleno',
  'Código Fonte TV',
  'Full Cycle',
  'Fabio Vedovelli',
  'Pagar.me Talks',
  'Filipe Deschamps',
  'Filho da nuvem',
  'Curso em Vídeo',
  'iMasters',
  'LuizTools',
  'Dev Soutinho',
  'EximiaCo',
  'Cloud Treinamentos',
  'BrazilJS',
  'Otavio Lemos',
  'Agilizei',
  'Novo Futuro Tech',
  'High Tech Cursos Fábrica de Programador',
  'Cod3r Cursos',
  'Guilherme Rodz'
]

const technologies = [
  'NextJS',
  'NodeJS',
  'Javascript',
  'HTML',
  'CSS',
  'API',
  'AdonisJS',
  'ReactJS',
  'Jquery',
  'Bootstrap',
  'MySQL',
  'SQL',
  'React Native',
  'Mobile',
  'Realmdb',
  'Git',
  'Github',
  'CRUD',
  'Redux',
  'MongoDB',
  'Express',
  'Deploy',
  'Heroku',
  'Rest',
  'TDD',
  'BDD',
  'Cypress',
  'Jest',
  'Sequelize',
  'Fastfy',
  'Restify',
  'Typescript',
  'PHP',
  'Laravel',
  'Microserviço',
  'NestJS',
  'Prisma',
  'Swagger',
  'Lambda',
  'AWS',
  'Serverless',
  'Solid',
  'PostgreSQL',
  'Clean Architecture',
  'Style guide',
  'Eslint',
  'Prettier',
  'Editor Config',
  'Firebase',
  'Ajax',
  'WSL',
  'Docker',
  'Kubernates',
  'VueJS',
  'Algoritmo',
  'Programação Funcional',
  'POO',
  'Programação Orientada a Objeto',
  'Tailwind CSS',
  'Python',
  'Pandas',
  'Scrum',
  'Kanban',
  'Azure',
  'GCP',
  'Nuxt'
]

const technologiesLower = technologies.map(tech => tech.toLocaleLowerCase())

function sanitizeString(str) {
  str = str.replace(/([^a-z0-9áéíóúñü_-\s\.,]|[\t\n\f\r\v\0])/gim, "");
  return str.trim();
}

function durationToTime(durationString) {
  const durationFormated = duration.parse(durationString)
  return durationFormated
}

let myhistory = readJsonFile({ filename: 'myhistory.json' })

if(!myhistory) {
  const history = readJsonFile({ filename: 'histórico-de-visualização.json' })

  const historyByChannelsAndTechs = []

  history.forEach(history => {
    if (history.subtitles) {
      if (channels.includes(history.subtitles[0].name)) {
        historyByChannelsAndTechs.push({
          id: history.titleUrl.split('v=')[1],
          title: history.title,
          channel: history.subtitles[0].name
        })
      }

      technologiesLower.forEach(tech => {
        if (sanitizeString(history.title.toLocaleLowerCase()).split(" ").includes(tech)) {
          if (!historyByChannelsAndTechs.find(item => item.title === history.title)) {
            historyByChannelsAndTechs.push({
              id: history.titleUrl.split('v=')[1],
              title: history.title,
              channel: history.subtitles[0].name
            })
          }
        }
      })
    }
  })

  console.log(historyByChannelsAndTechs.length)

  const getDurationWithYoutubeVideoId = async (id, index) => {
    try {
      await sleep(index * 10)
      const { data } = await axios(`https://www.googleapis.com/youtube/v3/videos?id=${id}&key=${process.env.YOUTUBE_KEY}&part=contentDetails`)
      console.log('index', index, id)
      return data.items[0] ? durationToTime(data.items[0].contentDetails.duration) : {}
    } catch (error) {
      console.log('error', error.response.status)
    }
  }

  const historyByChannelsAndTechsWithVideoDuration = await Promise.all(historyByChannelsAndTechs.map(async (history, index) =>{
    const duration = await getDurationWithYoutubeVideoId(history.id, index)
    return {
      id: history.id,
      title: history.title,
      channel: history.channel,
      duration
    }
  }))

  // console.log(historyByChannelsAndTechsWithVideoDuration)
  saveJsonFile('myhistory.json', JSON.stringify(historyByChannelsAndTechsWithVideoDuration))

  myhistory = JSON.stringify(historyByChannelsAndTechsWithVideoDuration)
}

const youtubeTotalDuration = myhistory.reduce((history, part) => {
  const duration = {
    hours: part.duration && history.duration ? part.duration.hours + history.duration.hours : history?.duration?.hours || 0,
    minutes: part.duration && history.duration ? part.duration.minutes + history.duration.minutes : history?.duration?.minutes || 0,
    seconds: part.duration && history.duration ? part.duration.seconds + history.duration.seconds : history?.duration?.seconds || 0,
  }

  if(duration.seconds > 60) {
    duration.minutes += 1
    duration.seconds -= 60
  }

  if(duration.minutes > 60) {
    duration.hours += 1
    duration.minutes -= 60
  }

  return { duration }

}, {})

console.log('youtubeTotalDuration', youtubeTotalDuration)

// console.log(historyByChannelsAndTechs)


