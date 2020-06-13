Репозиторий содержит прототип SPA интернет магазина на фреймворке htmlix

Для работы данного примера требуется node.js, для установки на компьютер ввести в консоли `npm install`

Для запуска примеров: `node app` и перейти по адресу `localhost:3000/`

Скачать фреймворк можно <a href="https://github.com/SergeyOvechkin/htmlix"> здесь  </a>

Фронтенд: htmlix.js

Бекэнд: node.js, express.js, formidable, twig, nedb

<img height="350" src="https://github.com/SergeyOvechkin/lesson_2.2/blob/master/htmlix_shop.jpg">


	Папки:
	
	  app.js - входной скрипт сервера	  
      dbase - база данных
			carts.db - таблица карточек товара
			categories.db - таблица категорий
		
	  modules - яваскрипт файлы для работы сервера
			
			joinTableField.js - join запросы для базы данных
			validate_form.js - валидация данных форм при post запросах
			router_category.js - роутер для запросов начинающихся с "/category"
			router_index.js - роутер для запросов начинающихся с "/"
			
	 static - папка для отдачи статических файлов
			
			css - css - файлы
			js - яваскрипт файлы
				htmlix.js - фреймворк htmlix
				front.js - экземпляр приложения htmlix
				
			templates - все шаблоны для загрузки в fetch запросе 
			upload - папка с картинками для карточек товара
	
	views - папка с twig шаблонами для сервера
	

	