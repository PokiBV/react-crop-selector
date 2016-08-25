const path = require('path');
const allStyles = require('../../tmp/styles.json');

const root = path.normalize(`${__dirname}/../..`);

require.extensions['.css'] = function cssModules(m, fileName) {
	const relativePath = fileName.replace(`${root}/`, '');
	const styles = allStyles[relativePath];

	// eslint-disable-next-line no-underscore-dangle
	return m._compile(`module.exports = ${JSON.stringify(styles)}`, fileName);
};
