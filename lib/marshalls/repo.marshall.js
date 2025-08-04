'use strict'

const { URL } = require('node:url')
const Warning = require('../helpers/warning.js')
const BaseMarshall = require('./baseMarshall.js')
const { marshallCategories } = require('./constants.js')

const MARSHALL_NAME = 'repo'

class Marshall extends BaseMarshall {
  constructor(options) {
    super(options)
    this.name = MARSHALL_NAME
    this.categoryId = marshallCategories.PackageHealth.id
  }

  title() {
    return 'Identifying package repository...'
  }

  validate(pkg) {
    return this.packageRepoUtils.getPackageInfo(pkg.packageName).then((data) => {
      const lastVersionData =
        (data.versions &&
          data['dist-tags'] &&
          data['dist-tags'].latest &&
          data.versions[data['dist-tags'].latest]) ||
        data
      if (lastVersionData && lastVersionData.repository && lastVersionData.repository.url) {
        let urlStructure
        let urlOfGitRepository
        try {
          urlStructure = new URL(lastVersionData.repository.url)
          urlOfGitRepository = new URL(`https://${urlStructure.host}${urlStructure.pathname}`)
        } catch {
          throw new Warning('No valid repository is associated with the package')
        }

        return fetch(urlOfGitRepository.href).catch(() => {
          throw new Warning(
            `The repository associated with the package (${urlOfGitRepository.href}) does not exist or is unreachable at the moment.`
          )
        })
      }

      if (lastVersionData && lastVersionData.homepage) {
        return fetch(lastVersionData.homepage).catch(() => {
          throw new Warning(
            `The homepage associated with the package (${lastVersionData.homepage}) does not exist or is unreachable at the moment.`
          )
        })
      }

      throw new Warning('The package has no associated repository or homepage.')
    })
  }
}

module.exports = Marshall
