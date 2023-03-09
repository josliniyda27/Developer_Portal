const pino = require("pino");

const levels = {
  error: 50,
  info: 20,
  debug: 10,
};

const streams = Object.keys(levels).map((level) => {
  return {
    level: level,
    stream: pino.destination(`./node_logger/node-app-${level}.log`),
    
  };
});

process.env.TERMINAL_LOG ? streams.push({ stream: process.stdout }) : null;

const commonLogs = pino(
  {
    customLevels: levels,
    enabled: true,
  },
  pino.multistream(streams)
);

//export default commonLogs;
module.exports = commonLogs;
