//const commonLogs = require("../../../common/logger.js");
import db from './examples.db.service';

class ExamplesService {
  all() {
    commonLogs.info(`${this.constructor.name}.all()`);
    return db.all();
  }

  byId(id) {
    console.log(`${this.constructor.name}.byId(${id})`);
    return db.byId(id);
  }

  create(name) {
    return db.insert(name);
  }
}

export default new ExamplesService();
