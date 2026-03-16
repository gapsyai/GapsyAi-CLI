const fs = require('fs');
const path = require('path');

const getContext = () => {
	const configPath = path.join(process.cwd(), '.gapsy');
	let context = {};
	
	if (fs.existsSync(configPath)) {
		try {
			const data = fs.readFileSync(configPath, 'utf8');
			context = JSON.parse(data);
		} catch (e) {}
	}

	// Quantum-Synergy: Attach project index if available (RAG)
	const indexPath = path.join(process.cwd(), '.gapsy_index');
	if (fs.existsSync(indexPath)) {
		try {
			context.projectIndex = fs.readFileSync(indexPath, 'utf8');
		} catch (e) {}
	}

	return Object.keys(context).length > 0 ? context : null;
};

module.exports = { getContext };
