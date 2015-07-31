var FMConstants = require('../constants/FileManagerConstants');
var oxygenType = require('../../public/img/oxygen-mimetypes/mimetypes.js');

var iconTypes = {};
iconTypes[FMConstants.ICON_TYPE_OXYGEN] = oxygenType;


var MimeIcon = {
	getIconSrc: function(type, mime) {
		if (! iconTypes.hasOwnProperty(type)) {
			throw "Unknown icon type " + type;
		}

		var src = iconTypes[type]['unknown'];
		if (iconTypes[type].hasOwnProperty(mime)) {
			src = iconTypes[type][mime];
		}

		return CONSTS.BASE_PATH + '/img/' + src;
	}
};

module.exports = MimeIcon;