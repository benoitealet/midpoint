const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const fs = require('fs');

//https://gist.github.com/JamieMason/0566f8412af9fe6a1d470aa1e089a752
const groupBy = key => array =>
    array.reduce((objectsByKeyValue, obj) => {
        const value = obj[key];
        objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
        return objectsByKeyValue;
    }, {});

async function clean(model, routerService) {

    let data = await model.Http.findAll({
        where: {
            date: {
                [Op.lt]: Sequelize.literal('(SELECT CASE retention WHEN 0 THEN NULL ELSE DATETIME(\'NOW\', \'-\' || retention || \' minutes\') END FROM proxies WHERE proxies.id = http.proxy)')
            }
        },
        order: [
            ['date', 'DESC']
        ]
    });

    //group data by proxy

    //broadcast all group to everyone, but filter by connected proxy with callbackFilter

    const groups = groupBy('proxy')(data);

    Object.keys(groups).forEach((groupKey) => {
        routerService.broadcaster.broadcast(
            JSON.stringify({
                type: 'clean',
                list: groups[groupKey].map(http => http.id)
            }), (client) => {
                //send only if correct group (=proxyId)
                return groupKey = client.proxy.id;
            }
        );
    });

    await model.Header.destroy({
        where: {
            http: data.map(h => h.id)
        }
    });

    //suppression des fichiers dans storage

    await new Promise((resolve, reject) => {
        const storageDir = __dirname + '/../storage/';
        data.forEach((http) => {
            fs.readdir(storageDir, (err, files) => {
                if(err) {
                    console.log('Readdir:', err);
                }
                const allPromises = [];
                files.forEach(f => {
                    if(f.startsWith(http.id + '_')) {
                        allPromises.push(new Promise((unlinkResolve, unlinkReject) =>
                        {
                            fs.unlink(storageDir + f, (err) => {
                                if (err) {
                                    console.log('Unlink:', err);
                                    unlinkReject(err);
                                } else {
                                    unlinkResolve();
                                }
                            });
                        }));
                    }
                });
                Promise.all(allPromises).then(resolve).catch(reject);
            });
        });
    });


    await model.Http.destroy({
        where: {
            id: data.map(h => h.id)
        }
    });


}

module.exports = {

    initClean(httpModel, routerService) {
        setInterval(() => clean(httpModel, routerService), 1000);
    }

}
