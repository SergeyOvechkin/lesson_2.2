

module.exports = function(db){


var express = require('express');
var router = express.Router();

	//join запросы для базы данных
var joinTable = require('./joinTableField');
	


//получаем первые 6 карточек товара из базы данных
router.use( function(req, res, next){
	
			
				db.carts.find({}).limit(6).exec(function (err, docs) {
				
						if (err) {
							next(err);
							return;
						}
					req.carts = docs;					
					next();		
				});	
				
}, 
function(req, res, next){
	
			//получаем все категории из базы данных
				db.categories.find({}, function (err, docs) {
				
						if (err) {
							next(err);
							return;
						}
					req.categories = docs;

                    //res.json(docs);					
					next();		
				});	
				
},function(req, res, next){
	
	// соединяем таблици- присоединяем карточке товара два поля "titleCategory" и "variant_tmpl" из таблици с категориями, первые два параметра это таблици, 3 и 4 параметр - ключи в таблицах по которым идет сравнение	
	joinTable(req.carts, req.categories, "category", "idCategory", "titleCategory", "variant_tmpl",  next);
	
	
		
});
// отправляем представление с найдеными таблицами
router.get('/', function(req, res) {
	
 			res.render('index.twig', {
			carts : req.carts, categories : req.categories,  activeCategory:  req.categories.idCategory
    });
});
// отправляем json ответ на fetch запрос 
router.get('/json', function(req, res) {
  res.json(req.carts);
});




 return  router };