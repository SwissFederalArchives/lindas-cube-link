#!/usr/bin/env node

import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join, basename } from 'path'
import { Parser } from 'n3'
import rdf from 'rdf-ext'
import SHACLValidator from 'rdf-validate-shacl'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

async function loadTurtle(content) {
  return new Promise((resolve, reject) => {
    const parser = new Parser()
    const quads = []
    parser.parse(content, (error, quad) => {
      if (error) {
        reject(error)
      } else if (quad) {
        quads.push(quad)
      } else {
        const dataset = rdf.dataset(quads)
        resolve(dataset)
      }
    })
  })
}

async function validateFile(filePath, expectedConforms) {
  const content = readFileSync(filePath, 'utf-8')
  const name = basename(filePath)

  try {
    const dataset = await loadTurtle(content)
    // The dataset contains both shapes (the constraint) and data (observations)
    // rdf-validate-shacl expects shapes and data as separate datasets,
    // but the cube tests use the same file for both
    const validator = new SHACLValidator(dataset)
    const report = await validator.validate(dataset)

    const conforms = report.conforms

    if (conforms === expectedConforms) {
      console.log(`PASS - ${name}: sh:conforms ${conforms}`)
      return true
    } else {
      console.log(`FAIL - ${name}: expected sh:conforms ${expectedConforms}, got ${conforms}`)
      return false
    }
  } catch (error) {
    console.log(`ERROR - ${name}: ${error.message}`)
    console.log(error.stack)
    return false
  }
}

// Main test runner
const observationsDir = join(__dirname, 'observations')

// Test cases with expected conformance results
// Based on the .approved.txt files
const testCases = [
  { file: 'undefinedAllowed.ttl', conforms: true },
  { file: 'undefinedNotAllowed.ttl', conforms: false },
  { file: 'undefinedOrBounded.ttl', conforms: true },
  { file: 'withoutName.ttl', conforms: true },
  { file: 'withoutType.ttl', conforms: true }
]

let failed = false

for (const testCase of testCases) {
  const filePath = join(observationsDir, testCase.file)
  const passed = await validateFile(filePath, testCase.conforms)
  if (!passed) {
    failed = true
  }
}

process.exit(failed ? 1 : 0)
