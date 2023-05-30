
console.log('simple roblox asset downloader by puyo <hi@puyo.xyz> <https://github.com/puyoxyz>');
console.log('this is specifically for shirts and pants');

const cdnPath = 'https://assetdelivery.roblox.com/v1/asset/?id=';

let request; let xml2js; let parser; let fs;

try {
	request = require('request');
	fs = require('fs');
	xml2js = require('xml2js');
	parser = new xml2js.Parser({ attrkey: "ATTR" })
} catch {
	console.error('please install request and xml2js! (\'npm install request xml2js\')');
	process.exit(0);
}

if (process.argv[0]) {
	let initialId = process.argv[2];
	//console.log(cdnPath + initialId);

	request(cdnPath + initialId, {}, (error, response, body) => {
		if (error) return console.error(error);
		if (!body.includes('ShirtTemplate') && !body.includes('PantsTemplate')) { console.log(body); return console.error('couldn\'t find shirttemplate or pantstemplate'); } // make sure this is a valid shirt/pant
		parser.parseString(body, (xmlError, xmlResult) => {
			if (xmlError) return console.error(xmlError);
			let imageUrlBeforeFix = xmlResult.roblox.Item[0].Properties[0].Content[0].url[0]; // [0]s are required, because it dumb. also, this is very hardcoded, and will break at the slightest change of the format.
			
			if(imageUrlBeforeFix.includes('http://www.roblox.com/asset/?id=')) {
				let imageUrl = imageUrlBeforeFix.replace('http://www.roblox.com/asset/?id=', cdnPath);

				// this saves it, can't use a normal callback and save the result variable for some reason ?? but this works. so it fine
				// we don't catch errors here at all. Whatever!
				request(imageUrl)
					.pipe(fs.createWriteStream(initialId + '.png'))
					.on('close', () => { console.log('saved as ' + initialId + '.png. if it doesn\'t open, try changing the file extension to .jpg') })
			}
		});
	});
} else {
	console.error('you didn\'t provide a valid id. (example: \'node main.js 6533663172\')');
}
