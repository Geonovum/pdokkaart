/**
 * @author SEdney
 * 
 * code that is always required regardless of status of map components
 */

function loadCKeditor(){

//load text editor to enable marker content	
   CKEDITOR.replace( 'editor1',
   {
       height: 95,
	   EditorAreaCSS: 'ckeditor/skins/v2/editor.css', 		
       toolbar : [ ['Image','Link', 'Unlink', '-', 'Bold', 'Italic', '-','About']
       ]
   });	
   
   //fix ckeditor so that it removes unwanted functions
   CKEDITOR.on( 'dialogDefinition', function( ev )
	 {
		// Take the dialog name and its definition from the event
		// data.
		var dialogName = ev.data.name;
		var dialogDefinition = ev.data.definition;

		// Check if the definition is from the dialog we're interested in
		if ( dialogName == 'image' ){
			// Get a reference to the "Link Info" tab.
			var infoTab = dialogDefinition.getContents( 'info' );
		
		    //from Image Info tab remove the following:
		    infoTab.remove( 'txtAlt' );	//alternative text
			infoTab.remove( 'txtBorder'); //image border
			infoTab.remove( 'txtHSpace'); //horizonal space
            infoTab.remove( 'txtVSpace'); //vertical space
			infoTab.remove( 'cmbAlign' ); //alignement
		 
		    //remove advanced and link tabs
		 	dialogDefinition.removeContents( 'advanced' );
			dialogDefinition.removeContents( 'Link' );
		}
		if ( dialogName == 'link' ){
		   dialogDefinition.removeContents( 'target' );	
		   dialogDefinition.removeContents( 'advanced' );			
		}			
	}); 	
	
	return false;
	
	
}