'use strict';
const path = require('path');

const getDockerfileMatrixEntry = (file) => {
  
  const folder = path.dirname(file);

  return {
    folder
  };
};

const generateBuildMatrix = (files) => {
//   const dockerfiles = [...new Set(getAffectedDockerfiles(files))];

//   const entries = dockerfiles.map(getDockerfileMatrixEntry);
  const entries = files.map(getDockerfileMatrixEntry);

  // Return null if there are no entries so we can skip the matrix step
  return entries.length
    ? { include: entries }
    : null;
};

module.exports = generateBuildMatrix;
