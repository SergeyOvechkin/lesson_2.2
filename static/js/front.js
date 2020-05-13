
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
		props: [ "data", "click", 'class', "title", ['listner_click_on_category', "emiter-click-on-category", ""]],
		methods: {
			
			click: function(){
								
				this.rootLink.stateMethods.click_on_category(this, event);	
								
			},
			listner_click_on_category: function(){
				
				this.parent.props.class.removeProp("active");
				
				if(this.parent.props.data.getProp() == this.emiter.prop){
					
					this.parent.props.class.setProp("active");
				}				
			},
			
	
			
		}		
	},
	carts: {
		arrayProps: [ ['listener_load_carts', "emiter-load-carts", ""] ],
		arrayMethods: { 
		
		  listener_load_carts: function(){
				
					//this.parent.removeAll();
			        var cartsArray = [];
					
					for(var i=0; i<this.rootLink.stateProperties.carts.length; i++){
						
						var prop = this.rootLink.stateProperties.carts[i];
						
						var props = {
							
							title: prop.title,
							title_category: prop.titleCategory,
							cost: prop.cost,
							src_img: '/static/upload/'+prop.image,
							data: "/cart/"+prop._id
						}
						cartsArray.push(props);
						//this.parent.add(props);
					}
					this.parent.reuseAll(cartsArray);
			}
		},
		container: "cart",
		props: ['title', "title_category",  "cost", "click", "src_img", "data"  ],
		methods: {
			
			click: function(){
				
				event.preventDefault();
				//console.log(event);
				var url = this.parent.props.data.getProp();
				this.rootLink.router.setRout(url);
				this.rootLink.eventProps["emiter-click-on-cart"].setEventProp(this.parent.index);
				
			}
		}
		
	},
	cart_single: {
		container: "cart_single",
		props: ["variant_tmpl",'title', "title_category", "manufacture", "cost", "description", "cost_btn", "src_img", ["listner_click_on_cart", "emiter-click-on-cart", ""], "click_category", "data"],
		methods: {
			
			listner_click_on_cart: function(){
				
				var index = this.emiter.getEventProp();
				
				var prop = this.rootLink.stateProperties.carts[index];
				
				var props = {
							
							title: prop.title,
							title_category: prop.titleCategory,
							cost: prop.cost,
							src_img: '/static/upload/'+prop.image,
							data: prop.category,
							description:  prop.description,
							cost_btn: prop.cost,
							manufacture: prop.manufacture,
							variant_tmpl: prop.variant_tmpl,
							//variant_tmpl: {componentName: "cart_variant_radio", data:[{radio: true}, {radio: true}]},
						}
						
					this.parent.setAllProps(props);	
					
			},
			click_category: function(){
				
	                 this.rootLink.stateMethods.click_on_category(this, event);
			
		    }	
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
					
					this.rootLink.stateMethods.load_carts(url+"json", this);
					this.rootLink.stateMethods.load_categories("/categories/json", this);
					
				}else if(url == "/create/cart"){
					
					this.rootLink.stateMethods.load_categories("/categories/json", this);
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
				props: ["submit"],
				methods: { 
				 submit: function(){
					 
						this.rootLink.stateMethods.click_on_submit(this, event, "категория сохранена", "/create/category", "create_category");

									
				}
			}		
	},
	create_cart: {
				container: "create_category",
				props: ["select_group_category",  ['listner_load_categories', "emiter-load-categories", ""],  "submit" ],
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
					
					this.rootLink.stateMethods.click_on_submit(this, event, "карточка сохранена", "/create/cart", "create_cart");
							
				}
			},
				
	},
	cart_variant_option: {
		container: "cart_variant_option",
		props: ["click", "select"],
		methods: { 
				click: function(){
					
					console.log(this.parent.props.select.getProp());
					
					console.log(this.rootLink.state["cart_single"].getAllProps({cost: "", title: "", variant_tmpl: {select: ""} }));
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
					
					console.log(this.rootLink.state["cart_single"].getAllProps({cost: "", title: "", variant_tmpl: {radio: ""} }));
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
	stateProperties:{
		
		carts: [],
		categories: [],
		
	},
	stateMethods: {
		
		fetchCategoryCarts: function(url, callb){ 
					
					fetch(url)
					
					.then((response) => {
						if(response.ok) {
							return response.json();
						}	
            
						throw new Error('Network response was not ok');
					})
					.then((json) => {
						
						//console.log( json );
						callb(json);

					})
					.catch((error) => {
							console.log(error);
					});
		
		
		}, 
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
		click_on_category: function(context, event){
				
				event.preventDefault();				
				
				var historyUrl = "/category/"+context.parent.props.data.getProp();
				var url = historyUrl+"/json";
				
				context.rootLink.eventProps["emiter-click-on-category"].setEventProp(context.parent.props.data.getProp());
				
				context.rootLink.router.setRout(historyUrl);
				//console.log(url);
				context.rootLink.stateMethods.load_carts(url, context);
				
			},
			click_on_submit: function(context, event, mess, url, form_name){
				
				event.preventDefault();				
				
				var oldForm = document.forms[form_name];
					 var formData  = new FormData(oldForm);
					 				 
					context.rootLink.stateMethods.sendPost(url, formData, function(data){ 
					if(data.err){
						alert(data.err);
						
						}else{
							console.log(data);
							alert(mess+" --" + data);
							
						}
					 
					
					} );
				
			},	
		load_carts:  function(url, context ){


				context.rootLink.stateMethods.fetchCategoryCarts(url, function(data){
					
					context.rootLink.stateProperties.carts = data;
					
					context.rootLink.eventProps["emiter-load-carts"].setEventProp(data);				
					
				});
			},
		load_categories:  function(url, context ){


				context.rootLink.stateMethods.fetchCategoryCarts(url, function(data){
					
					context.rootLink.stateProperties.categories = data;
					
					
					context.rootLink.eventProps["emiter-load-categories"].setEventProp(data);				
					
				});
			},
		
	},
	stateSettings: {
		
		//fetchCategoryCartsUrl: "category/json/",
		
		
	}
	
	

}
var routes = {
	
	["/"]: {
		
		first: ["categories", 'carts', "menu", "home_page"], /// компоненты которые есть в html файле указываются в этом массиве, остальные будут загружены с шаблона, в fetch запросе асинхронно
		routComponent: {
			
			router_carts: "carts",
			router_main: "home_page"
			
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
		
		HM.stateMethods.fetchCategoryCarts(url, function(arr){  HM.stateProperties.carts = arr; });
		
		console.log(HM);
	}