import glitchImageData from '../glitch/glitchImageData';

export default function worker ( self ) {
	self.addEventListener( 'message', function ( msg ) {
		let imageData = msg.data.imageData;
		let params = msg.data.params;
		let base64URL = msg.data.base64URL;

		if ( imageData && base64URL && params ) {
			try {
				// phantomjs seems to have some memory loss so we need to make sure
				if ( typeof imageData.width === 'undefined' && typeof msg.data.imageDataWidth === 'number' ) {
					imageData.width = msg.data.imageDataWidth;
				}

				if ( typeof imageData.height === 'undefined' && typeof msg.data.imageDataHeight === 'number' ) {
					imageData.height = msg.data.imageDataHeight;
				}

				let glitchedBase64URL = glitchImageData( imageData, base64URL, params );
				success( glitchedBase64URL );

			} catch ( err ) {
				fail( err );
			}

		} else {
			if ( msg.data.imageData ) {
				fail( 'Parameters are missing.' );
			} else {
				fail( 'ImageData is missing.' );
			}
		}
		
		self.close();
	} );
}

function fail ( err ) {
	self.postMessage( { err: err.message || err } );
}

function success ( base64URL ) {
	self.postMessage( { base64URL: base64URL } );
}
