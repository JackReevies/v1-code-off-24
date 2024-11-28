import fs from 'fs'

async function start() {
  const text = fs.readFileSync('expenses.txt', 'utf8').toString()

  const arr = text.split('\n')

  // Find two numbers that sum to 2020
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length; j++) {
      if (i === j) continue

      const a = parseInt(arr[i])
      const b = parseInt(arr[j])
      if (a + b === 2020) {
        console.log(a, b)
        console.log(a * b)
      }
    }
  }
}

function p2() {
  const input = [0, 1, 0, 1, 0]

  const allFish = {}

  input.forEach(o => addFish(0, Number(o), 1, allFish))

  for (let i = 1; i <= 80; i++) {
    breedSingleDay(allFish, i)
    console.log(`After day ${i} there are ${getTotalFish(allFish)} fish`)
  }

  return getTotalFish(allFish)
}

function breedSingleDay(allFish, day) {
  const keys = Object.keys(allFish)
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const fish = allFish[key]

    fish.timeLeft--

    if (fish.timeLeft === -1) {
      fish.timeLeft = 6
      addFish(day, 8, fish.instances, allFish)
    }
  }
}

function getTotalFish(allFish) {
  return Object.values(allFish).reduce((acc, obj) => acc + obj.instances, 0)
}

function addFish(birthday, cooldown, instances, obj) {
  if (obj[`${birthday}-${cooldown}`]) {
    obj[`${birthday}-${cooldown}`].instances += instances
    return
  }
  obj[`${birthday}-${cooldown}`] = { birthday, cooldown, timeLeft: cooldown, instances: instances }
}

function p3() {
  const input = fs.readFileSync('bots.txt', 'utf8').toString().split('\n')
  const state = getStartingChips(input)
  ensureBot(state, -1)
  doIteration(state)

  debugger
}

function doIteration(bots) {
  let changesMade = 0
  for (const bot in bots) {
    const botObj = bots[bot]

    if (botObj.inventory.length !== 2) continue

    // Look at rules and distribute
    const low = Math.min(...botObj.inventory)
    const high = Math.max(...botObj.inventory)

    if (botObj.inventory.includes(61) && botObj.inventory.includes(17)) {
      debugger
    }

    bots[botObj.outLow].inventory.push(low)
    bots[botObj.outHigh].inventory.push(high)

    bots[bot].inventory = []
    changesMade++
  }

  if (changesMade === 0) return

  doIteration(bots)
}

function ensureBot(bots, bot) {
  if (!bots[bot]) {
    bots[bot] = { inventory: [], outLow: -1, outHigh: -1 }
  }
}

function giveToBot(bots, bot, value) {
  ensureBot(bots, bot)
  bots[bot].inventory.push(value)
}

function getStartingChips(input) {
  // Record<number, {inventory: [], outLow: number, outHigh: number}>
  const bots = {}

  input.forEach(o => {
    const regex = /value (\d+) goes to bot (\d+)/.exec(o) || []
    const [_, value, bot] = regex

    if (value && bot) {
      giveToBot(bots, bot, Number(value))
    }
  })

  getRules(bots, input)
  return bots
}

function getRules(bots, input) {
  input.forEach(o => {
    const regex = /bot (\d+) gives low to (output|bot) (\d+) and high to (output|bot) (\d+)/.exec(o) || []
    const [_, bot, lowType, low, highType, high] = regex

    if (_ === undefined) return

    ensureBot(bots, bot)

    if (lowType === 'bot') {
      bots[bot].outLow = Number(low)
    }

    if (highType === 'bot') {
      bots[bot].outHigh = Number(high)
    }
  })
}

console.log(p3())