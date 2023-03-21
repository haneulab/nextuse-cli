function parsePageConfig_(data) {
	return JSON.parse(data);
}

function attributeExist_(parsedObject, key, fail) {
	if (!parsedObject[key]) {
		fail();
	} else {
		return parsedObject[key];
	}
}

module.exports = {
	parsePageConfig_,
	attributeExist_
};
