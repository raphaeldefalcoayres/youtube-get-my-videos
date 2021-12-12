import axios from 'axios'
import dotenv from 'dotenv'
import fs from 'fs'
import * as duration from 'duration-fns'

dotenv.config()

let rawdata = fs.readFileSync('histórico-de-visualização.json')
let history = JSON.parse(rawdata)

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
const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

// console.log(historyByChannelsAndTechs)
console.log(historyByChannelsAndTechs.length)

const getDurationWithYoutubeVideoId = async id => {
  const { data } = await axios(`https://www.googleapis.com/youtube/v3/videos?id=${id}&key=${process.env.YOUTUBE_KEY}&part=contentDetails`)
  return data.items[0] ? durationToTime(data.items[0].contentDetails.duration) : {}
}

const historyByChannelsAndTechsWithVideoDuration = await Promise.all(historyByChannelsAndTechs.map(async history =>{
  const duration = await getDurationWithYoutubeVideoId(history.id)
  return {
    id: history.id,
    title: history.title,
    channel: history.channel,
    duration
  }
}))

console.log(historyByChannelsAndTechsWithVideoDuration)
// fs.writeFileSync('myhistory.json', JSON.stringify(historyByChannelsAndTechs))