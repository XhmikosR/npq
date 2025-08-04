'use strict'

const Warning = require('../helpers/warning.js')
const BaseMarshall = require('./baseMarshall.js')
const { marshallCategories } = require('./constants.js')

const MARSHALL_NAME = 'downloads'
const DOWNLOAD_COUNT_THRESHOLD = 100 // threshold per month
const DOWNLOAD_COUNT_UPPER_THRESHOLD = 10_000 // threshold per month

class Marshall extends BaseMarshall {
  constructor(options) {
    super(options)
    this.name = MARSHALL_NAME
    this.categoryId = marshallCategories.PackageHealth.id
  }

  title() {
    return 'Checking package download popularity'
  }

  validate(pkg) {
    return this.packageRepoUtils.getDownloadInfo(pkg.packageName).then((downloadCount) => {
      if (downloadCount < DOWNLOAD_COUNT_THRESHOLD) {
        throw new Error(
          `Detected a low download-count package (downloads last month < ${DOWNLOAD_COUNT_THRESHOLD})`
        )
      }

      if (downloadCount < DOWNLOAD_COUNT_UPPER_THRESHOLD) {
        throw new Warning(
          `Detected a low relatively low download-count package (${downloadCount} downloads last month)`
        )
      }

      return downloadCount
    })
  }
}

module.exports = Marshall
