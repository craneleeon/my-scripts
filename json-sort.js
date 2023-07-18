const fs = require('fs');

// Get the file names from the command line arguments
const fileA = process.argv[2];
const dataA = JSON.parse(fs.readFileSync(fileA, 'utf-8'));
const sortedA = sortKeys(dataA);
fs.writeFileSync(fileA, JSON.stringify(sortedA, null, 2));

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
