		   if(parCont.share_layout != undefined){
			   
			   var layout = document.querySelector('[data-'+parCont.container+']').cloneNode(true); 
			  // parentHtml.hasAttribute(name)
			   layout.removeAttribute('data-'+parCont.container);
			   layout.setAttribute('data-'+thisCont.container, "container");
			   
			   for(var t=0; t< parCont.props.length; t++){
				   
				   if(typeof parCont.props[t] == "string"){
	
					   var prop = layout.querySelector('[data-'+parCont.container+'-'+parCont.props[t]+']');
				
					   prop.removeAttribute('data-'+parCont.container+'-'+parCont.props[t]);
					    prop.setAttribute('data-'+thisCont.container+'-'+parCont.props[t], "container");
					   
					   
				   }
			   }
			   
			   var insert = layout.querySelector(parCont.share_layout);
			   insert.innerHTML = "";
			   var ObjParent=insert.parentNode;
			   ObjParent.replaceChild(this.htmlLink, insert);
			   
			  // insert.outerHTML(this.htmlLink); //.appendChild();
			   
			   this.htmlLink.removeAttribute('data-'+thisCont.container);
			   
			   this.htmlLink = layout;
			   		   
			   console.log(layout);			   
		   }	