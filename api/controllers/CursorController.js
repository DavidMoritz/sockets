/**
 * CursorController
 *
 * @description :: Server-side logic for managing cursors
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	// moveCursor:function (req,res) {
		
	// 	var data_from_client = req.params.all();

	// 	if(req.isSocket && req.method === 'POST'){

	// 		// This is the message from connected client
	// 		// So add new conversation
	// 		Cursor.create(data_from_client)
	// 			.exec(function(error,data_from_client){
	// 				console.log(data_from_client);
	// 				Cursor.publishCreate({id: data_from_client.id, left : data_from_client.left , top:data_from_client.top});
	// 			}); 
	// 	}
	// 	else if(req.isSocket){
	// 		Cursor.watch(req.socket);
	// 		console.log( 'User subscribed to ' + req.socket.id );
	// 	}
	// }	
	
};

