const fs = require('fs');
const path = require('path');

const getContext = () => {
	const configPath = path.join(process.cwd(), '.gapsy');
	if (fs.existsSync(configPath)) {
		try {
			const data = fs.readFileSync(configPath, 'utf8');
			return JSON.parse(data);
		} catch (e) {
			return null;
		}
	}
	return null;
};

module.exports = { getContext };
