define(["jquery","jqueryparse"], function($) {

	return {



		init: function() {

		var insertRelation = function (productid, categoryid) {

             db = window.openDatabase("catalogue", "", "Catalogue des produits", 1024*1000);
             db.transaction(function(tx) {

                           tx.executeSql('INSERT INTO produits_categories (product_id, category_id) VALUES (?, ?)', [productid, categoryid], function(tx, res) {
                            console.log('INSERT the relation produits_categories [ product_id: ' + productid + ' - category_id: ' + categoryid + ' ] ') 
                          })
             })
		}

		db = window.openDatabase("catalogue", "", "Catalogue des produits", 1024*1000);


         // BEGIN OF MAIN TRANSACTION
         db.transaction(function(tx) {

          var create_products_table = 'CREATE TABLE IF NOT EXISTS produits(id INTEGER PRIMARY KEY, code TEXT, nom TEXT, description TEXT, prix TEXT, details TEXT)';
          var create_categories_table = 'CREATE TABLE IF NOT EXISTS categories(id INTEGER PRIMARY KEY, nom TEXT, description TEXT)';
          var create_relation_table = 'CREATE TABLE IF NOT EXISTS produits_categories(product_id INTEGER NOT NULL, category_id INTEGER NOT NULL, PRIMARY KEY (product_id, category_id))';
          // BEGIN PRODUCTS QUERY 
          tx.executeSql(create_products_table, [], function (tx, res) {
          console.log('-----> Create table produits <------')               
           // BEGIN CATEGORIES QUERY 
           tx.executeSql(create_categories_table, [], function (tx, res) {
           console.log('-----> Create table categories <------')          
           // BEGIN RELATION QUERY 
           tx.executeSql(create_relation_table, [], function (tx, res) {
             console.log('-----> Create table produits_categories <------')
                // BEGIN NUMBER PRODUCTS QUERY 
                 tx.executeSql('SELECT * FROM produits',[], function (tx, res) {  
                 var rowsi = res.rows;                 
                 window.nbrproducts = rowsi.length;

                 localStorage.setItem( "nbrproducts", rowsi.length );
                 sessionStorage.setItem( "indexnav", '0' );

                 // CHECK IF NUMBER EQUAL TO ZERO
                 if(res.rows.length == 0) {

                    /*$.mobile.loading('show', {
                            text: 'Please wait while retrieving data...',
                            theme: 'z',
                            textVisible: true
                    });
					*/

                    // BEGIN AJAX CVS
             
                   $.get( "produits/liste.csv", function( data ) {
                   var r = $.parse(data);
                   var prows = r.results["rows"];

                   // BEGIN OF FOR LOOP GETING PRODUCTS FROM CSV
                   for (var i = 0; i < prows.length; i++) {
                        console.log('Get the [ ' + prows[i]["nom"] + ' ] from CSV file')
                        console.log('=================================================') 
                        var codeproduit = (prows[i]['code']).toString();
                        var nomproduit = prows[i]['nom'];
                        var descriptionproduit = prows[i]['description'];
                        var prixproduit = prows[i]['prix'];
                        var tagsproduit = prows[i]['tags'];
                        var detailsproduit = prows[i]['details'];
                         console.log('* tagsproduit: ' + tagsproduit)
                        var tagsproductarray = [];
                        if(tagsproduit.indexOf("|")!=-1)
                          tagsproductarray = tagsproduit.split('|');
                        else if(tagsproduit.length!=0) tagsproductarray[0] = tagsproduit;
                        else tagsproductarray[0] = 'Général';

                        // BEGIN INSERT CLOSURE 
                       (function(codeproduit, nomproduit, descriptionproduit, prixproduit, tagsproductarray, detailsproduit, nbrprods) {

                        var product_id;

                          db.transaction(function(tx) {

                           tx.executeSql('INSERT INTO produits (code, nom, description, prix, details) VALUES ( ?, ?, ?, ?, ?)', [codeproduit, nomproduit, descriptionproduit, prixproduit, detailsproduit], function(tx, res) {
                            console.log('===========================================') 
                            console.log('-----> SQL: DATA INSERT IN DATABASE <------')

                            console.log('The product ' + nomproduit + ' inserted | It s ID is : ' + res.insertId + ' tagarray_len ' + tagsproductarray.length) 
                            console.log('===========================================') 

                            var product_tag;
                            
                           // sessionStorage.setItem(pName,)

                          if(tagsproductarray.length!=0) {

                          (function(tagsproductarray, productid, nbrprods) {
                             db.transaction(function(tx) {
                                for (var u = 0; u < tagsproductarray.length; u++) {
                                    
                                    product_tag = tagsproductarray[u];
                                    (function(product_tag, productid, nbrprods) {
                                        db.transaction(function(tx) {
                                          tx.executeSql('SELECT * FROM categories WHERE nom = ?',[product_tag], function (tx, re) {
                                            //console.log('re.rows.length (exist) ' + re.rows.length + ' --> product_tag: ' + product_tag +' | productid: '+ productid)
                                             if (!re.rows.length) {

                                               tx.executeSql('INSERT INTO categories (nom) VALUES (?)', [product_tag], function(tx, res) {
                                                 //console.log('The product ' + nomproduit + ' inserted') 
                                                 //console.log(' || INSERT ||||| Category ID : ' + res.insertId + '+++++++++++++ Product ID : ' + productid)
                                                 console.log('-----> INSERT category: '+ product_tag +' <------')
                                                 insertRelation(productid, res.insertId)
                                                 //var product_tag;
                                               });
                                           } else {
                                                insertRelation(productid, re.rows.item(0).id)
                                           }

                                           console.log('/////////// nbrprods= ' + nbrprods + '///////////productid= ' + productid)
                                           /*if( nbrprods == productid) {
                                               console.log('============ initTagsReady.resolve(); ==================')
                                               displayTags()
                                           }
                                           */

                                          /*var str = "";
                                          console.log('rrows.length: ' + rrows.length)
                                          console.log('rrows.item(i).c: ' + rrows.item(0).c)
                                          */
                                        }); 
                                      });

                                     })(product_tag, productid, nbrprods)
                                   };

                                  



                                   

                                });  
                        })(tagsproductarray, res.insertId, nbrprods)

                      } 







                            });  
                         });  





                        console.log('/////////// nbrprods= ' + nbrprods)

                          

                      })(codeproduit, nomproduit, descriptionproduit, prixproduit, tagsproductarray, detailsproduit, prows.length);
                      // END INSERT CLOSURE

                     // alert('product_id: ' + product_id);




                      console.log('==============================')
                      console.log('==============================')
                      console.log('==============================')

                      // END OF FOR LOOP GETING PRODUCTS FROM CSV  

                    

                       

                     }

                      /* console.log('============ initTagsReady.resolve(); ==================')
                     initTagsReady.resolve();*/

                     //$.mobile.loading('hide');

                    // END AJAX CVS
                    })


                  // CHECK IF NUMBER EQUAL TO ZERO
                  }


            // END NUMBER PRODUCTS QUERY 
            });

      // END OF RELATION QUERY

          });

      // END OF CATEGORIES QUERY 

       });


      // END OF PRODUCTS QUERY 
      });

 
// END OF MAIN TRANSACTION
})

		}
	}
})