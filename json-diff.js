const fs = require('fs');

// Get the file names from the command line arguments
const fileA = process.argv[2];
const fileB = process.argv[3];

// Read in the two JSON files  and parse them
const dataA = JSON.parse(fs.readFileSync(fileA, 'utf-8'));
const dataB = JSON.parse(fs.readFileSync(fileB, 'utf-8'));

// Recursively sort the keys in the objects
const sortedA = sortKeys(dataA);
const sortedB = sortKeys(dataB);

// Write the sorted objects to output files
fs.writeFileSync(fileA, JSON.stringify(sortedA, null, 2));
fs.writeFileSync(fileB, JSON.stringify(sortedB, null, 2));

// Compare the two objects and output the differences to a file
const {updated, added, deleted} = compareObjects(sortedA, sortedB);
fs.writeFileSync('diff-update.json', JSON.stringify(updated, null, 2));
fs.writeFileSync('diff-add.json', JSON.stringify(added, null, 2));
fs.writeFileSync('diff-delete.json', JSON.stringify(deleted, null, 2));

/**
 * Recursively sort the keys in an object
 * @param {Object} obj 
 * @returns {Object} The input object with sorted keys
 */
function sortKeys(obj) {
  if (typeof obj !== 'object') {
    return obj;
  }
  const sorted = {};
  Object.keys(obj).sort().forEach(key => {
    sorted[key] = sortKeys(obj[key]);
  });
  return sorted;
}

/**
 * Recursively compare two objects and return an object with only the differences
 * @param {Object} objA 
 * @param {Object} objB 
 * @returns {Object} An object with only the differences
 */
function compareObjects(objA, objB) {
  const updated = {} 
  const added = {} 
  const deleted = {}
  for (let key in objA) {
    if (!objB.hasOwnProperty(key)) {
      deleted[key] = objA[key];
    } else if (typeof objA[key] === 'object') {
      // Recursively compare nested objects
      const nestedDiff = compareObjects(objA[key], objB[key]);
      if (Object.keys(nestedDiff.updated).length > 0) {
        updated[key] = nestedDiff.updated;
      }
      if (Object.keys(nestedDiff.added).length > 0) {
        added[key] = nestedDiff.added;
      }
      if (Object.keys(nestedDiff.deleted).length > 0) {
        deleted[key] = nestedDiff.deleted;
      }
    } else if (objB[key] !== objA[key]) {
      updated[key] = objB[key];
    }
  }
  for (let key in objB) {
    if (!objA.hasOwnProperty(key)) {
      added[key] = objB[key];
    }
  }
  return {updated, added, deleted};
}
