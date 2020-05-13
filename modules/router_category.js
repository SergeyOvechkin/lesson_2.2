

module.exports = function(db, idCategory){


var express = require('express');
var router = express.Router();

	//join запросы для базы данных
var joinTable = require('./joinTableField');
	


// сохраняем параметр :idCategory в req обьекте запроса  
router.use("/:idCategory", function(req, res, next){
	req.idCategory = req.params.idCategory;
	next();
} );

router.use("/:idCategory/json", function(req, res, next){
	req.idCategory = req.params.idCategory;
	next();
	
} );

router.use( function(req, res, next){
	
			//получаем массив с категориями
				db.categories.find({}, function (err, docs) {
				
						if (err) {
							next(err);
							return;
						}
					req.categories = docs;

                    //res.json(docs);					
					next();		
				});	
				
},
function(req, res, next){
	
			//ищем все карты по сохраненной в req.idCategory id категории
			db.carts.find({category : req.idCategory}, function (err, docs){
				
				if (err){
					next(err);
					return;
				}
					req.carts = docs;
					
                 //console.log(req.idCategory);
					next();		
			});
	
},function(req, res, next){
	
	// соединяем таблици- присоединяем карточке товара два поля "titleCategory" и "variant_tmpl" из таблици с категориями, первые два параметра это таблици, 3 и 4 параметр - ключи в таблицах по которым идет сравнение
	
	joinTable(req.carts, req.categories, "category", "idCategory", "titleCategory", "variant_tmpl", next);
	
	
	
});
// отправляем представление передав в него найденые категории и карточки товара, а также активную категорию
router.get('/:idCategory', function(req, res) {
	
       res.render('index.twig', { categories: req.categories, carts: req.carts, activeCategory:  req.idCategory});
});
// отправляем json ответ на fetch запрос '/:idCategory/json'
router.get('/:idCategory/json', function(req, res) {
  res.json(req.carts);
});




 return  router };