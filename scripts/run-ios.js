const { exec, spawn } = require('child_process')
const inquirer = require('inquirer')

function filterAvailableDevices(devices) {
  return Object.entries(devices)
    .filter(([group]) => /iOS/.test(group))
    .reduce((matching, [_, list]) => {
      return matching.concat(
        list
          .filter(d => !d.availabilityError && /iPhone/.test(d.name))
          .map(d => d.name),
      )
    }, [])
}

async function getAvailableDevices() {
  return new Promise((resolve, reject) => {
    exec('xcrun simctl list --json devices', (err, res) => {
      if (err) {
        return reject(err)
      }
      const { devices } = JSON.parse(res)
      return resolve(filterAvailableDevices(devices))
    })
  })
}

async function run() {
  const { device } = await inquirer.prompt([
    {
      name: 'device',
      type: 'list',
      choices: await getAvailableDevices(),
    },
  ])
  const ls = spawn(
    './node_modules/.bin/react-native',
    ['run-ios', `--simulator=${device}`],
    {
      stdio: 'pipe',
    },
  )
  ls.stdout.on('data', data => process.stdout.write(data))
  ls.stderr.on('data', data => process.stderr.write(data))
  ls.on('error', error => {
    console.error(error)
    process.exit(1)
  })
  ls.on('close', _ => {
    process.stdout.write('\n')
    process.exit(0)
  })
}

run()
