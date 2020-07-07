
var State = {

 categories: {
	    arrayProps: [  ['listner_load_categories', "emiter-load-categories", ""]],
        arrayMethods: { 
		
				listner_load_categories: function(){
				
				this.parent.removeAll();
				
				for(var i=0; i<this.rootLink.stateProperties.categories.length; i++){
						
						var prop = this.rootLink.stateProperties.categories[i];
						
						var props = {
							
							title: prop.titleCategory,
							data: prop.idCategory,
	
						}					
						this.parent.add(props);
					}				
			},		
	},
    container: "category", 
    //добавили слушатель события "emiter-click-on-category"
    props: [ "data", "click", 'class', "title",  ['listner_click_on_category', "emiter-click-on-category", ""]],
    methods: {
      click: function(){

       event.preventDefault();
       var categoryId = this.parent.props.data.getProp();       
       //вызываем событие "emiter-click-on-category"
       // передав в него данные со свойства data контейнера по которому был клик
        this.rootLink.eventProps["emiter-click-on-category"].setEventProp(categoryId);

        //создаем url на основе данных со свойства data контейнера,
        //один для истории - historyUrl понадобится нам в дальнейшем,
           // второй чтобы сделать запрос для получения карточек товара на адрес /category/:idCategory/json

           var historyUrl = "/category/"+categoryId;
           var url = historyUrl+"/json";               

           this.rootLink.stateMethods.load_carts(url);
		   
		   //меняем компонент в div теге  `data-router_carts="router"` - на carts 
		   this.rootLink.router.setRout(historyUrl);    

    },
    listner_click_on_category: function(){ 
      //в слушателе события клика по категории удаляем класс "active" со всех контейнеров
      // затем устанавливаем его на контейнере данные свойства data которого совпадают
      // с данными передаными в событие "emiter-click-on-category"

        this.parent.props.class.removeProp("active");

        if(this.parent.props.data.getProp() == this.emiter.prop){                   
          this.parent.props.class.setProp("active");
        }               
    },
  }        
 },
 carts: {
    //добавили свойство listener_load_carts для массива carts
     arrayProps: [ ['listener_load_carts', "emiter-load-carts", ""] ],
     arrayMethods: {         
       listener_load_carts: function(){ //слушаем событие "emiter-load-carts"

         this.parent.removeAll(); //очищаем массив

         var carts = this.emiter.prop;

        for(var i=0; i<carts.length; i++){
         //в цикле перебираем полученный массив с карточками товара 

           var cart = carts[i];

           var props = { //создаем объект со всеми свойствами для контейнера cart

            title: cart.title,
            title_category: cart.titleCategory,
            cost: cart.cost,
            src_img: '/static/upload/'+cart.image,
            data: "/cart/"+cart._id
           }

            this.parent.add(props); 
                //добавляем новый контейнер передав в него начальные данные для свойств
        }
     }
    },
    container: "cart",
    //добавили все свойства для контейнера cart
    props: ['title', "title_category",  "cost", "click", "src_img", "data"  ],
    methods: {
         click: function(){ //метод для обработки кликов по карточке товара, 

           event.preventDefault();                
           var url = this.parent.props.data.getProp(); //в свойстве data контейнера cart у нас url крточки товара.
           console.log(url);
 

           //добавили вызов события  "emiter-click-on-cart"  которое мы слушаем в компоненте single_cart 
           //передаем в него индекс контейнера по которому кликнули
           this.rootLink.eventProps["emiter-click-on-cart"].setEventProp(this.parent.index);

            //вызываем метод setRout передав в него новый url,
            // чтобы роутер поменял компонент carts на cart_single в div элементе с data-router_carts="router"  
           this.rootLink.router.setRout(url);  

		  
        }
    }     
 },
 cart_single: {
   container: "cart_single",
   
   props: [
      "variant_tmpl", 'title', "title_category", "manufacture", "cost", "description", "cost_btn", 
       "src_img", ["listner_click_on_cart", "emiter-click-on-cart", ""], "data", /*"click",*/ 
	   ["click", "extend", "categories", "props"]///наследуем свойство из компонента "category"
   ], 
   methods: {

    listner_click_on_cart: function(){

        var index = this.emiter.getEventProp(); 
                 //получаем индекс контейнера карточки по которой кликнули в компоненте carts

        var cart = this.rootLink.stateProperties.carts[index];
                //выбираем из загруженных раннее в массиве карточек нужную нам по индексу контейнера 

        var props = {

           title: cart.title,
           title_category: cart.titleCategory,
           cost: cart.cost,
           src_img: '/static/upload/'+cart.image,
           data: cart.category,
           description:  cart.description,
           cost_btn: cart.cost,
           manufacture: cart.manufacture,
           variant_tmpl: cart.variant_tmpl,

         }

        this.parent.setAllProps(props);
             //устанавливаем новые значения сразу для всех свойств, с помощью метода setAllProps(props);                 
    },
	/*
    click: function(){
       event.preventDefault(); 
           console.log(this.parent.props.data)                
     } */ 
      },
},
	menu: {
		container: "menu_item",
		props: ['click', "class", "data",   ["listener_click_on_main_menu" ,"emiter-click-on-main-menu", "" ] ],
		methods: {
			
			click: function(){
				
				event.preventDefault();
				
				var url = this.parent.props.data.getProp();
				
				this.rootLink.eventProps["emiter-click-on-main-menu"].setEventProp(url);
				
				if(url == "/home"){
					url = "/";
					
					this.rootLink.stateMethods.load_carts(url+"json");
					this.rootLink.stateMethods.load_categories("/categories/json");
					
				}else if(url == "/create/cart"){
					
					this.rootLink.stateMethods.load_categories("/categories/json");
				}
				
				this.rootLink.router.setRout(url);
				
			},
			listener_click_on_main_menu:  function(){
				
				 this.parent.props.class.removeProp("active");
				
				  if(this.parent.props.data.getProp() == this.emiter.prop){
					
					this.parent.props.class.setProp("active");
				}
				
			},			
		}		
	},
	/// router main
	home_page: {
				container: "home_page",
				props: [],
				methods: { 
				
				}		
	},
	create_category: {
				container: "create_category",
				props: ["submit", ["click_on_submit", "extend", "create_cart", "props"]],//наследуем вспомогательный метод
				methods: { 
				 submit: function(){
					 
						this.parent.methods.click_on_submit(event, "категория сохранена", "/create/category", "create_category");

									
				}
			}		
	},
	create_cart: {
				container: "create_cart",
				props: ["select_group_category",  ['listner_load_categories', "emiter-load-categories", ""],  "submit", ["click_on_submit", "aux"] ],
				methods: { 
					listner_load_categories: function(){
						
						var categories = this.emiter.getEventProp();				
						this.parent.props.select_group_category.clearGroup();

						for(var i=0; i<categories.length; i++){
					
							var props = {
							
								text: categories[i].titleCategory,
								select: categories[i].idCategory,	
							}
							var container = this.parent.props.select_group_category.groupArray.add(props);
							
							this.parent.props.select_group_category.addToGroup(container);
						}				
				},
				submit: function(){
					
					this.parent.methods.click_on_submit(event, "карточка сохранена", "/create/cart", "create_cart");
					
							
				},
				click_on_submit: function(event, mess, url, form_name){ //вспомогательный метод
					
					event.preventDefault();				
				
				     var oldForm = document.forms[form_name];
					 var formData  = new FormData(oldForm);
					 				 
					this.rootLink.stateMethods.sendPost(url, formData, function(data){ 
					if(data.err){
						alert(data.err);
						
						}else{
							console.log(data);
							alert(mess+" --" + data);
							
						}
					 
					
					} );	
					
				}
			},
				
	},
cart_variant_option: {
     container: "cart_variant_option", // views/twig_templates/  data-cart_variant_option="container"

     props: ["click", "select"],  //data-cart_variant_option-select="select" , data-cart_variant_option-click="click"
     methods: { 
          click: function(){

                 console.log(this.parent.props.select.getProp());
           }
     }
},
cart_variant_radio: {
    selector: "div:last-of-type",
    container: "cart_variant_radio_cont",
    props: ["click", "radio"],
    methods: { 

        click: function(){

             console.log(this.parent.index+" --- "+this.parent.props.radio.getProp());
        }

    }

  },
 virtualArrayComponents: {
		
	create_cart_select: {
			   container: "select_container",
				props: ["select", "text"],
				methods: { 
				
				}	
		
	},
			
},	
  stateProperties:{ //объект для хранения общих переменных приложения        
    carts: [],   
    categories: [],	
  },
  stateMethods: {
    fetchCategoryCarts: function(url, callb){ 
    // общий  метод для загрузки данных с какого либо адреса get запросм, 
       //принимает в параметрах адрес - url и функцию обратного вызова callb,
      // в которую он передаст полученные данные 

       fetch(url).then((response) => {
        if(response.ok) {
           return response.json();
        }             
          throw new Error('Network response was not ok');
        }).then((json) => {
        callb(json); 
            }).catch((error) => {
         console.log(error);
         });    
    }, 
	//общий метод для отправки данных на сервер методом POST
	sendPost: function(url, formData, callb){ 
					
					fetch(url, {
						
						method: 'POST',
						body: formData
					})
					
					.then((response) => {
						if(response.ok) {
							return response.json();
						}	
						//console.log(response);
						throw new Error('Network response was not ok');
					})
					.then((json) => {

						callb(json);

					})
					.catch((error) => {
							console.log(error);
							alert(error);
					});
		
		
		}, 
    load_carts:  function(url){ 
    //метод вызывает fetchCategoryCarts передавая в него функцию обратного вызова 
    // в которой подставляем данные с сервера в переменную carts объекта stateProperties
	//this в методах из объекта stateMethods указывает на rootLink
	
       var context = this;
	   
       this.stateMethods.fetchCategoryCarts(url, function(data){

           context.stateProperties.carts = data;

           context.eventProps["emiter-load-carts"].setEventProp(data);                

        });
    },
	load_categories:  function(url){
                
				var context = this;
				
				this.stateMethods.fetchCategoryCarts(url, function(data){
					
					context.stateProperties.categories = data;					
					
					context.eventProps["emiter-load-categories"].setEventProp(data);				
					
				});
	},
 },
	eventEmiters: {
		 
		 ["emiter-click-on-category"] : {
				
				prop: [],
				
		},
		["emiter-click-on-cart"] : {
				
				prop: "",
				
		},
		["emiter-click-on-main-menu"]: {
			
			  prop: "",
		},
		["emiter-load-carts"]: {
			
			prop: "",
		}
		,
		["emiter-load-categories"]: {
			
			prop: "",
		}
		
	},       
}

var routes = {
	
     ["/"]: {
		
		first: ["categories", 'carts', "menu", "home_page"], /// компоненты которые есть в html файле указываются в этом массиве, остальные будут загружены с шаблона, в fetch запросе асинхронно
		routComponent: {
			
			router_carts: "carts",
			router_main: "home_page",
		
			
		}, //компоненты соответствующие данному роуту
		
		templatePath: "/static/templates/index.html" // папка для загрузки шаблонов
	},	
	
    ["/cart/:idCart"]: { //знак : в начале слова - говорит что это параметр и сравенение не требуется, проверяет только его наличие на данной позиции
		
		first: ["categories", 'cart_single', "menu", "home_page"], 
		routComponent: {
			router_carts: "cart_single",
			router_main: "home_page",
			
		},
		templatePath: "/static/templates/index.html"
	},
	
    ["/category/:idCategory"]: { 
		
		first: ["categories", 'carts', "menu", "home_page"], 
		routComponent: {
			
			router_carts: "carts",
			router_main: "home_page"
			
		}, 
		templatePath: "/static/templates/index.html" 
	},	
	
    ["/create/category"]: {
		
		first: ["menu", "create_category"], 
		routComponent:{ 
									
			router_main: "create_category"
		}, 
		templatePath: "/static/templates/index.html" 
	},	
	
    ["/create/cart/"]: {
		
		first: ["menu", "create_cart"], 
		routComponent:{ 
									
			router_main: "create_cart"
		}, 
		templatePath: "/static/templates/index.html" 
	},
	
	
}
window.onload = function(){

    ///создаем экземпляр  HTMLix
    var HM = HTMLixRouter(State, routes);

        var url = window.location.pathname;

        if(window.location.pathname == "/"){

        url = url+"json";

        }else{

         url = url + "/json";
        }   

       //отправляем запрос чтобы загрузить массив со всеми карточками товара при первой загрузке приложения    
      HM.stateMethods.fetchCategoryCarts(url, function(arr){  HM.stateProperties.carts = arr; });
      console.log(HM);
}