'use strict'

const childProcess = require('node:child_process')

const DEFAULT_PKGMGR = 'npm'

const packageManager = {
  process(packageManagerOption) {
    const detectedPackageManager = packageManager.validatePackageManager(packageManagerOption)
    return packageManager.spawnPackageManager(detectedPackageManager)
  },

  spawnPackageManager(packageManagerOption) {
    let args = []
    args = args.concat(process.argv.slice(2)).filter((item) => {
      switch (item) {
        case '--packageManager':
        case '--pkgMgr':
        case '--dry-run': {
          return false
        }

        default: {
          return true
        }
      }
    })

    let cmd = `${packageManagerOption}`
    if (args.length > 0) {
      cmd += ` ${args.join(' ')}`
    }

    const child = childProcess.spawn(cmd, {
      stdio: 'inherit',
      shell: true
    })

    return Promise.resolve(child)
  },

  validatePackageManager(packageManagerOption) {
    packageManagerOption ||= packageManager.getDefaultPackageManager()

    if (typeof packageManagerOption !== 'string') {
      throw new TypeError('a packageManager should be specified as a string')
    }

    return packageManagerOption
  },

  getDefaultPackageManager() {
    return DEFAULT_PKGMGR
  }
}

module.exports = packageManager
