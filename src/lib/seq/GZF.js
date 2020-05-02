const DAO = require('./DAO');

const getAllKeys = ([obj = {}], exceptedKeys) => {
  const fields = Object.keys(obj);
  const updateOnDuplicate = fields.filter(
    (item) => !exceptedKeys.includes(item),
  );
  return {
    fields,
    updateOnDuplicate,
  };
};

class GZF extends DAO {
  constructor(...arg) {
    super(...arg);
  }

  sync(project, house, emove, period, qualification) {
    this.model.sync();
    project.model.sync();
    house.model.sync();
    emove.model.sync();
    period.model.sync();
    qualification.model.sync();
  }

  recode(project, house, emove, period, qualification, un, { jsonData } = {}) {
    let obj = {};
    try {
      obj = JSON.parse(jsonData);
    } catch (e) {
      console.log('recode error -> ', e);
    }
    const queueHouseArr = obj.queueHouseData;
    const arr = obj.queueData;

    // project
    const projectArr = queueHouseArr.map(item => (item.project || {}));
    {
      const { updateOnDuplicate, fields } = getAllKeys(projectArr, ['id']);
      project.model.bulkCreate(projectArr, {
        updateOnDuplicate,
        fields,
      });
    }

    // house
    const houseArr = queueHouseArr.map(item => {
      return {
        id: item.id,
        apiId: item.apiId,
        pstructId: item.pstructId,
        propertyPstructId: item.propertyPstructId,
        name: item.name,
        fullName: item.fullName,
        floorName: item.floorName,
        propertyName: item.propertyName,
        typeName: item.typeName,
        area: item.area,
        rent: item.rent,
        state: item.state,
        isSearchRoom: item.isSearchRoom,
        selectable: item.selectable,
        splitedMark: item.splitedMark,
        splitedSex: item.splitedSex,
        createTime: item.createTime,
      }
    });
    {
      const { updateOnDuplicate, fields } = getAllKeys(houseArr, ['id']);
      house.model.bulkCreate(houseArr, {
        updateOnDuplicate,
        fields,
      });
    }

    // emove
    const emoveArr = queueHouseArr.map(item => {
      return {
        emoveInDate: item.emoveInDate,
        pstructId: item.pstructId,
      }
    });
    {
      const { updateOnDuplicate, fields } = getAllKeys(emoveArr, ['id']);
      emove.model.bulkCreate(emoveArr, {
        updateOnDuplicate,
        fields,
      });
    }

    // queue
    const queueArr = arr.map((item) => ({
      id: item.id,
      position: item.position,
      status: item.status,
      createTime: item.createTime,
      updateTime: item.updateTime,
      cancelTime: item.cancelTime,
      pstructId: item.pstructId,
      serverAccountId: item.serverAccountId,
      periodId: item.period && item.period.id,
    }));
    {
      const { updateOnDuplicate, fields } = getAllKeys(queueArr, ['id']);
      this.model.bulkCreate(queueArr, {
        updateOnDuplicate,
        fields,
      });
    }

    // period
    const periodArr = arr.map(item => {
      const period = item.period || {};
      return {
        id: period.id,
        apiId: period.apiId,
        name: period.name,
        startTime: period.startTime,
        endTime: period.endTime,
      }
    });
    {
      const { updateOnDuplicate, fields } = getAllKeys(periodArr, ['id']);
      period.model.bulkCreate(periodArr, {
        updateOnDuplicate,
        fields,
      });
    }

    // qualification
    const qualificationArr = arr.map(item => {
      const qualification = item.qualification || {};
      return {
        id: qualification.id,
        dataId: qualification.dataId,
        code: qualification.code,
        name: qualification.name,
        serverAccountId: qualification.serverAccountId,
        maxSelectableHouseType: qualification.maxSelectableHouseType,
        used: qualification.used,
        startDate: qualification.startDate,
      }
    });
    {
      const { updateOnDuplicate, fields } = getAllKeys(qualificationArr, ['id']);
      qualification.model.bulkCreate(qualificationArr, {
        updateOnDuplicate,
        fields,
      });
    }
  }
}

module.exports = GZF;
