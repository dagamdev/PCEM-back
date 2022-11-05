const { botId } = require("../db")
const { PCEMbotDB } = require("../models/index")

let botDB = {}
;(async ()=> {
  botDB = await PCEMbotDB.findById(botId)
})()


const getBot = () => botDB

const getBotLogs = () => botDB.logs

const updateBotLogs = async (data) => await PCEMbotDB.findByIdAndUpdate(botId, {logs: {...botDB.logs, ...data}})

const addBotLog = async (req, res) => await PCEMbotDB.findByIdAndUpdate(generalData.botId, {logs: {...botDB.logs, ...req.body}})


const deleteBotLog = async (req, res) => {

  if(!Object.keys(req.body).some(s=> s=='log')) return res.send({message: 'log property not found on object'})
  if(!req.body['log']) return res.send({message: 'log property value does not exist'})

  delete botDB.logs[req.body['log']]
  console.log(botDB.logs)
  await PCEMbotDB.findByIdAndUpdate(generalData.botId, {logs: botDB.logs})
  res.send({message: 'delete log'})
}

const getBotAutoModeration = (req, res) => {
  if(botDB.autoModeration) res.send(botDB.autoModeration)
  else sendMessage(res, 'auto moderation not found')
}

const addBotAutoModeration = async (req, res) => {
  const { type } = req.params, { id } = req.body

  if(!['ignoreCategories', 'ignoreChannels'].some(s=> s==type)) return sendMessage(res, 'auto moderation type is invalid, use ignoreCategories or ignoreChannels')
  if(!id) return sendMessage(res, 'id value not found or property does not exist')
  
  if(type == 'ignoreCategories'){
    botDB.autoModeration[type].push(id)
    await PCEMbotDB.findByIdAndUpdate(generalData.botId, {autoModeration: botDB.autoModeration})
    sendMessage(res, 'new category added')
  }

  if(type == 'ignoreChannels'){
    botDB.autoModeration[type].push(id)
    await PCEMbotDB.findByIdAndUpdate(generalData.botId, {autoModeration: botDB.autoModeration})
    sendMessage(res, 'new channel added')
  }
}

const deleteBotAutoModeration = async (req, res) => {
  const { type } = req.params, { id } = req.body

  if(!['ignoreCategories', 'ignoreChannels'].some(s=> s==type)) return sendMessage(res, 'auto moderation type is invalid, use ignoreCategories or ignoreChannels')
  if(!id) return sendMessage(res, 'id value not found or property does not exist')
  
  if(type == 'ignoreCategories'){
    botDB.autoModeration[type].splice(botDB.autoModeration[type].findIndex(f=> f==id), 1)
    await PCEMbotDB.findByIdAndUpdate(generalData.botId, {autoModeration: botDB.autoModeration})
    sendMessage(res, 'deleted category')
  }

  if(type == 'ignoreChannels'){
    botDB.autoModeration[type].splice(botDB.autoModeration[type].findIndex(f=> f==id), 1)
    await PCEMbotDB.findByIdAndUpdate(generalData.botId, {autoModeration: botDB.autoModeration})
    sendMessage(res, 'deleted channel')
  }
}


module.exports = {
  getBot,
  getBotLogs,
  updateBotLogs,
  addBotLog,
  deleteBotLog,
  getBotAutoModeration,
  addBotAutoModeration,
  deleteBotAutoModeration
}