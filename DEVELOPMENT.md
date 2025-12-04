# Cube Link Development Guide

`cube-link` is a SHACL shapes library for validating RDF data cubes. It defines the vocabulary and constraints used to ensure data quality and interoperability within the LINDAS ecosystem.

## Overview

This repository contains:
- **Vocabulary**: The core `cube-link` vocabulary definition (`vocab.ttl`).
- **Validation Shapes**: SHACL constraints used to validate cubes (`validation/`).
- **Tests**: Test cases ensuring the constraints work as expected (`test/`).
- **Documentation**: Source files for the documentation website (`documentation/`, `meta/`, `relation/`).
- **Trifid Config**: Configuration for serving the vocabulary and documentation locally (`trifid/`).

## Directory Structure

- `vocab.ttl`: The main vocabulary definition for `https://cube.link/`.
- `validation/`: Contains SHACL shape files.
  - `basic-cube-constraint.ttl`: Minimal validation rules for a cube.
  - `profile-opendataswiss.ttl`: Constraints specific to the opendata.swiss profile.
  - `standalone-cube-constraint.ttl`: Constraints for standalone cubes.
- `test/`: Test data and scripts.
  - `basic-cube-constraint/`: Tests for basic cube constraints.
  - `observations/`: Tests for observation validation.
  - `*.approved.txt`: Expected output for tests (Approval Testing pattern).
- `trifid/`: Configuration for the Trifid server to host the vocabulary locally.
- `meta/`: Metadata and documentation for the meta-vocabulary.

## Prerequisites

- **Node.js**: Version 18 or later.
- **npm**: Included with Node.js.

## Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run All Tests**:
   ```bash
   npm test
   ```

## Running Tests

The project uses an **Approval Testing** pattern. This means the output of the validation is compared against a "known good" output stored in `*.approved.txt` files.

### Run Specific Tests

- **Observations**:
  ```bash
  npm run test:observations
  ```
- **Basic Cube Constraints**:
  ```bash
  npm run test:basic-cube-constraint
  ```
- **OpenDataSwiss Profile**:
  ```bash
  npm run test:profile-opendataswiss
  ```

### Handling Test Failures

If a test fails, it means the validation output differs from the approved text.
1. **Review the diff**: Check if the change is intentional.
2. **Approve the change**: If the new output is correct, you can approve it by running the test with the `--approve` flag (if supported by the script) or manually updating the `.approved.txt` file.
   *Note: The provided scripts in `package.json` wrap the shell scripts. You might need to run the shell script directly or update the command to pass flags.*

## Adding New SHACL Constraints

1. **Create/Edit Shape**: Add your SHACL shape to a file in `validation/`.
   - Example: `validation/my-new-constraint.ttl`
2. **Create Test Cases**: Add valid and invalid Turtle files in `test/my-new-constraint/`.
   - `valid.case1.ttl`
   - `invalid.case1.ttl`
3. **Add Test Script**: Add a new script entry in `package.json` to run `test/check-metadata.sh` with your new constraint name.
   ```json
   "test:my-new-constraint": "./test/check-metadata.sh my-new-constraint"
   ```
4. **Run Test**: Run `npm run test:my-new-constraint`. The first run will fail because there is no approved output yet.
5. **Approve Output**: Verify the output is correct and create the `.approved.txt` files.

## Testing Against Local Data

To test the constraints against a local data file (e.g., `my-data.ttl`):

You can use the `barnard59` CLI which is installed as a dev dependency.

```bash
npx barnard59 cube check-metadata --profile=https://cube.link/latest/shape/basic-cube-constraint < my-data.ttl
```

Or use the provided local setup scripts (see `local-setup/scripts/validate-cube.ps1` or `.sh`).

## Updating Vocabulary Documentation

The documentation is served using Trifid.

1. **Edit Content**: Modify `vocab.ttl` or files in `documentation/`.
2. **Run Local Server**:
   ```bash
   npm run trifid:local
   ```
3. **View**: Open `http://localhost:8080/` (or the port displayed in the console).

## Integration

- **cube-validator**: Uses these shapes to validate uploaded cubes. Changes here will affect the validation logic in the validator service.
- **cube-creator**: May use these shapes to guide the creation process or validate output.

Ensure any changes to the vocabulary or shapes are backward compatible or coordinated with updates to these consuming services.