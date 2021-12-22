import fs from 'fs'

export const sleep = ({ delay = 0 }) => new Promise((resolve) => setTimeout(resolve, delay))

export const saveJsonFile = ({ filename = 'file.json', content = {} }) => {
  fs.writeFileSync(filename, JSON.stringify(content))
}

export const readJsonFile = ({ filename }) => {
  try {
    const file = fs.readFileSync(filename)
    return JSON.parse(file)
  } catch (error) {
    return false
  }
}
