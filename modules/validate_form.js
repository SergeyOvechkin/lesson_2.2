
module.exports = function(req, res, next, fields, require){
	
	
	for (var key in fields){
		
		
		 fields[key] = fields[key].trim();
		 
		if(fields[key]  == "" ){
			
			var err = new Error('поля формы не должны быть пустыми');
			
			res.send({err: 'поля формы не должны быть пустыми'});
			return;
			
			// next(err);
		}
	}
	
	if(require == undefined){
		
		next();
	}
	for(var i=0; i< require.length; i++){
		
		if(fields[require[i]] == undefined){
			
			var err = new Error('нехватает поля '+require[i]);
			
			res.send({err: 'нехватает поля '+require[i]});
			return;
			//next(err);
		}
	}
	
	
	next();
}