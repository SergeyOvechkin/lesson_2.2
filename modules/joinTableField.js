  	module.exports =    function joinTable(table1, table2, table1_key, table2_key, table2_field, table2_field_2, callb){
				
				for(var i=0; i < table1.length; i++){
					
					for (var j=0; j < table2.length; j++){
						
						if(table2[j][table2_key] == table1[i][table1_key]){
							
							table1[i][table2_field] = table2[j][table2_field];
							
							table1[i][table2_field_2] = table2[j][table2_field_2];
							
							continue;
						}
					}
					
				}
				callb();
			}