var // шаблонизатор
    twig = require("twig"),
	
	express = require('express'),	
	path = require('path'),	
    app = express(),
	//модуль для работы с файлами нужен чтобы переместить скаченое изображение
	fs = require('fs'),
	
	//база данных
	Datastore = require('nedb'),
	
	//join запросы для базы данных
	joinTable = require('./modules/joinTableField'),
	
	//проверка пустых полей формы
	validForm = require('./modules/validate_form'),
	
	///получение данных с post запросов	
	formidable = require('formidable');
	
	
	// настройка шаблонизатора twig
	app.set('view engine', 'twig');
    app.set('views',  path.join(__dirname, 'views'));
	
	// статические файла
    app.use('/static', express.static(path.join(__dirname, 'static')));
	
	
	///Загрузка баз данных
	db = {};
	db.categories = new Datastore({filename: 'dbase/categories.db', corruptAlertThreshold: 1});
	db.categories.loadDatabase(function (err) {    
		console.log(err);
	});
	
	db.carts = new Datastore({filename: 'dbase/carts.db', corruptAlertThreshold: 1});
	db.carts.loadDatabase(function (err) {    
		console.log(err);
	});
	
	//роутер для индекс и категории запросов
	
	var router_index = require("./modules/router_index")(db);
	
	var router_category = require("./modules/router_category")(db);
	
    app.use('/', router_index);
		
	app.use('/category', router_category);
	
	app.get('/categories/json', function(req, res) {
	
	//console.log(req.categories);
  res.json(req.categories);
  
  
});

app.get('/cart/:idCart', function(req, res, next){
	
			//поиск карточки по id в базе данных
			db.carts.find({_id : req.params.idCart}, function (err, docs){
				
				if (err){
					next(err);
					return;
				}
					req.cart = docs;
					
                 
					next();		
			});
	
},function(req, res, next){
	
			    //поиск всех категорий 
				db.categories.find({}, function (err, docs) {
				
						if (err) {
							next(err);
							return;
						}
					req.categories = docs;

                    //res.json(docs);					
					next();		
				});	
				
}, function(req, res, next){
	
	// соединяем таблици- присоединяем карточке товара два поля "titleCategory" и "variant_tmpl" из таблици с категориями, первые два параметра это таблици, 3 и 4 параметр - ключи в таблицах по которым идет сравнение
	joinTable(req.cart, req.categories, "category", "idCategory", "titleCategory",  "variant_tmpl",  next);
	
	
	
},function(req, res){
		
	//отправляем представление карточки товара передав, в него переменные с категорями и карточками, а также активную категорию	
	 res.render('cart.twig', { categories: req.categories, cart: req.cart[0], activeCategory:  req.cart[0].category});
	       	
});

///отвен на fetch запрос
app.get('/cart/:idCart/json', function(req, res){
    res.json([]);
});

//форма для создания карточки товара
app.get('/create/cart',

/// получаем список всех категорий из базы данных и передаем его в переменной req.docs
function(req, res, next){
				
				db.categories.find({}, function (err, docs) {
					
						if (err) {
							next(err);
							return;
						}
					
					req.docs = docs;					
					next()
		       });	
},
// отправляем представление с формой передав в него массив с категориями categoryes
 function(req, res){
    res.render('create_cart.twig', { categories: req.docs
       
    });
});

///отвен на fetch запрос
app.get('/create/cart/json', function(req, res){
    res.json([]);
});

///получаем данные с формы и сохраняем новую карточку товара в базе данных
app.post('/create/cart', function(req, res, next){
	
		var form = formidable({ multiples: true, uploadDir: path.join(__dirname, 'static/upload') });
	
		form.parse(req, function(err, fields, files){
			if (err) {
				next(err);
				return;
			}
			
			req.body = {
				
				fields: fields,
				files: files,
				//создаем новое имя для скачаного файла добавляя расширение
				newPath: files.image.path+'.'+files.image.name.split(".")[1]
			}
			
			req.body.fields.image = files.image.name;
			
			
			
			
			
			
			next();
	    //console.log(fields);

		});
}, 
//валидация данных формы, в  массиве указаны обязательные поля
function(req, res, next){ 

       validForm(req, res, next, req.body.fields, ["category"]);

},
//преименовываем саченый файл с картинкой
function(req, res, next){		
			
		fs.rename(req.body.files.image.path , req.body.newPath, function(err){
				if (err){
					next(err);
					return;
				} 
				next();
		});
		
},
//вставляем данные карточки в базу данных
 function(req, res){
	
				db.carts.insert([{ category: req.body.fields.category, manufacture: req.body.fields.manufacture, title: req.body.fields.title, cost: req.body.fields.cost, 
				                   description: req.body.fields.description, image: path.basename(req.body.newPath) }], 
								   
								   function (err,  newDocs) {
									   
					                    if(err){
											next(err);
											return;
										} 
									    res.json(newDocs);
				});
     	
 }			
);

///форма для новой категории
app.get('/create/category', function(req, res){
    res.render('create_category.twig', {
    });
});

///отвен на fetch запрос
app.get('/create/category/json', function(req, res){
    res.json([]);
});

//сохраняем новую категорию в базе данных
app.post("/create/category", function (request, response, next) {
	
	var form = formidable({ multiples: true });
	
		form.parse(request, function(err, fields, files){
		
			if (err) {
				next(err);
				return;
			}
		
			request.body =  fields;
			next();
			
		});
	
	}, 
	//валидация формы 
function(req, res, next){
	
	validForm(req, res, next, req.body, ["variant_tmpl"]);
	
} ,
	
	//сохраняем новую категорию в базе данных
	function (request, response){
	
		db.categories.insert([{ titleCategory: request.body.titleCategory, idCategory: request.body.idCategory, variant_tmpl: request.body.variant_tmpl}], function (err,  newDocs) {
			if(err) {
				next(err);
				return;
			} 
			response.send(newDocs);
		});
   
	});
//обработка ошибок
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send(err.message);
});


  app.listen(3000);
  console.log("Express server listening on port 3000");
  
  

