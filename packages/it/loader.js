const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DATA_DIR = path.join(__dirname, '..', '..', 'data', 'it');

function generateHash(task) {
  const sentenceStr = task.sentence.map(u => u.text).join('|');
  const repliesStr = task.replies.map(r => r.correct).join('|');
  const combined = sentenceStr + '|' + repliesStr;
  return crypto.createHash('md5').update(combined).digest('hex').substring(0, 8);
}

function findJsonFiles(dir, files = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      findJsonFiles(fullPath, files);
    } else if (entry.name.endsWith('.json')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

function loadLevel(level) {
  const levelFile = path.join(DATA_DIR, level + '.json');
  if (!fs.existsSync(levelFile)) {
    console.warn(`Warning: ${level}.json not found`);
    return [];
  }
  
  try {
    const data = fs.readFileSync(levelFile, 'utf-8');
    const tasks = JSON.parse(data);
    
    return tasks.map(task => ({
      ...task,
      id: generateHash(task),
      level: level.toUpperCase()
    }));
  } catch (e) {
    console.error(`Error loading ${level}.json:`, e.message);
    return [];
  }
}

function loadAllLevels() {
  if (!fs.existsSync(DATA_DIR)) {
    console.warn('Data directory not found:', DATA_DIR);
    return {};
  }
  
  const files = findJsonFiles(DATA_DIR);
  const result = {};
  
  for (const file of files) {
    const level = path.basename(file, '.json').toUpperCase();
    try {
      const data = fs.readFileSync(file, 'utf-8');
      const tasks = JSON.parse(data);
      
      result[level] = (result[level] || []).concat(tasks.map(task => ({
        ...task,
        id: generateHash(task),
        level: level
      })));
    } catch (e) {
      console.error(`Error loading ${file}:`, e.message);
    }
  }
  
  return result;
}

function getTasksByLevel(level) {
  if (!fs.existsSync(DATA_DIR)) {
    console.warn('Data directory not found:', DATA_DIR);
    return [];
  }
  
  const allData = loadAllLevels();
  return allData[level.toUpperCase()] || [];
}

function getRandomTask(level) {
  const tasks = getTasksByLevel(level);
  if (!tasks || tasks.length === 0) {
    return null;
  }
  return tasks[Math.floor(Math.random() * tasks.length)];
}

function getAllLevels() {
  if (!fs.existsSync(DATA_DIR)) {
    return [];
  }
  
  const files = findJsonFiles(DATA_DIR);
  return files.map(f => path.basename(f, '.json').toUpperCase());
}

module.exports = {
  generateHash,
  loadLevel,
  loadAllLevels,
  getTasksByLevel,
  getRandomTask,
  getAllLevels,
  DATA_DIR
};