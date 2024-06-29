async function insertData(modelName, dataToInsert) {
    try {
        const data = await modelName.create(dataToInsert);
        return {
            succes: true,
            data: data
        };
    } catch (error) {
        return {
            succes: false,
            data: error
        };
    }
}

async function getData(modelName, excludeList = []) {
    try {
        const data = await modelName.findAll({
            attributes: { exclude: [...excludeList] }
        });
        return {
            succes: true,
            data: data
        };
    } catch (error) {
        return {
            succes: false,
            data: error
        };
    }
}

async function getByField(modelName, fieldName, fieldValue) {
    try {
        let query = { [fieldName]: fieldValue }
        const data = await modelName.findAll({
            where: query
        });
        if (data.length) {
            let allData = []
            data.forEach((each) => {
                allData.push(each.toJSON())
            })
            return {
                succes: true,
                data: allData
            };
        } else {
            return {
                succes: false,
                data: null
            };
        }
    } catch (error) {
        return {
            succes: false,
            data: error
        };
    }
}

async function updateData(modelName, fieldName, fieldValue, newData) {
    try {
        const data = await modelName.update(newData, {
            where: { [fieldName]: fieldValue }
        });
        return {
            succes: true,
            data: data
        };
    } catch (error) {
        return {
            succes: false,
            data: error
        };
    }
}

async function deleteData(modelName, fieldName, fieldValue,) {
    try {
        const data = await modelName.destroy({
            where: { [fieldName]: fieldValue }
        });
        return {
            succes: true,
            data: data
        };
    } catch (error) {
        return {
            succes: false,
            data: error
        };
    }
}

module.exports = { insertData, updateData, getData, deleteData, getByField }