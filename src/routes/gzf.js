const axiosDefault = require('axios');
const router = require('express').Router();

const axios = axiosDefault.create({
  withCredentials: true,
  timeout: 30000,
});

router.post('/', async (req, res) => {
  const { body } = req;
  const loginResult = await axios
    .post('https://select.pdgzf.com/api/v1.0/app/gzf/user/login', {
      ...body,
    })
    .catch((error) => {
      console.log('login error -> ', error);
    });
  const loginData = loginResult && loginResult.data && loginResult.data.data;
  if (!loginData) {
    return res.send('loginData fail');
  }
  console.log('login data -> ', loginData.name);

  const { accessToken, token } = loginData;
  const result = await axios
    .post('https://select.pdgzf.com/api/v1.0/app/gzf/house/list', {
      where: {
        keywords: '',
        township: null,
        projectId: null,
        typeName: null,
        rent: null,
      },
      pageIndex: 0,
      pageSize: 30,
    }, {
      withCredentials: true,
      headers: {
        gzfauthentication: accessToken,
        token,
      },
    })
    .catch((error) => console.log('house/list error', error));
  const houseListData = result && result.data && result.data.data;
  if (!houseListData) {
    return res.send('houseListData fail');
  }
  console.log('house/list data -> ', houseListData);
  const queueHouseData = houseListData.data.map(item => ({
    project: item.project, // 这里的project很详细,供接口保存
    id: item.id,
    apiId: item.apiId,
    pstructId: item.pstructId,
    propertyPstructId: item.propertyPstructId,
    name: item.name,
    fullName: item.fullName,
    floorName: item.floorName,
    propertyName: item.propertyName,
    emoveInDate: item.emoveInDate,
    typeName: item.typeName,
    area: item.area,
    rent: item.rent,
    state: item.state,
    isSearchRoom: item.isSearchRoom,
    selectable: item.selectable,
    splitedMark: item.splitedMark,
    splitedSex: item.splitedSex,
    createTime: item.createTime,
  }));
  const queueData = houseListData.data.reduce((total, current) => {
    return [
      ...total,
      ...(current.queue || []),
    ];
  }, []);
  axios.post('http://localhost:5050/graphql', {
    query: `
        mutation queue($jsonData: String, $jsonKeys: String){
         data:queue(jsonData: $jsonData, jsonKeys: $jsonKeys){
            ID
          }
        }
      `,
    variables: {
      jsonData: JSON.stringify({
        queueHouseData,
        queueData,
      }),
      jsonKeys: "[\"apiId\"]"
    },
  }).then(result => console.log('queue data', result)).catch(error => console.log('queue error', error));
  res.send({
    msg: 'ok',
    queueData,
  });

  return;
  const { data = [], totalCount } = houseListData;
  const houseResponses = await Promise.all(
    data.map((item) =>
      axios.get(`https://select.pdgzf.com/api/v1.0/app/gzf/house/${item.id}`, {
        withCredentials: true,
        headers: {
          gzfauthentication: accessToken,
          token,
        },
      }),
    ),
  ).catch((error) => console.log('get error', error));
  const houseData = houseResponses
    .map((house) => house && house.data && house.data.data)
    .filter((item) => item);
  console.log('houseData -> ', houseData.length);

  const houseList = houseData.map((item) => ({
    apiId: item.apiId,
    propertyName: item.propertyName,
    fullName: item.fullName,
    typeName: item.typeName,
    rent: item.rent,
    area: item.area,
    emoveInDate: item.emoveInDate,
    queueCount: item.queueCount,
    queue: (item.queue || []).map(queueItem => ({
      position: queueItem.position,
      id: queueItem.qualification.id,
      code: queueItem.qualification.code,
      name: queueItem.qualification.name,
      startDate: queueItem.qualification.startDate,
      maxSelectableHouseType: queueItem.qualification.maxSelectableHouseType,
    })),
  }));
  const queryData = houseList.map(item => ({
    apiId: item.apiId,
    propertyName: item.propertyName,
    fullName: item.fullName,
    typeName: item.typeName,
    rent: item.rent,
    area: item.area,
    emoveInDate: item.emoveInDate,
    queueCount: item.queueCount,
    queue: item.queue.map(queue => queue.startDate).join(','),
  }));
  axios.post('http://localhost:5050/graphql', {
    query: `
        mutation houseRecode($jsonData: String, $jsonKeys: String){
         data:houseRecode(jsonData: $jsonData, jsonKeys: $jsonKeys){
            ID
          }
        }
      `,
    variables: {
      jsonData: JSON.stringify(queryData),
      jsonKeys: "[\"apiId\"]"
    },
  }).then(result => console.log('store data', result)).catch(error => console.log('store error', error));
  res.send({
    totalCount: houseList.length,
    list: houseList,
  });
});

module.exports = router;
