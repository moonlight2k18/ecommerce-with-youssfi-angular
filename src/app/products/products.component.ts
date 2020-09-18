import { Component, OnInit } from '@angular/core';
import { CatalogueService } from '../services/catalogue.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  public products: any;
  public editPhoto: boolean;
  public currentProduct: any;
  selectedFiles: any;
  progress: number;
  currentFileUploaded: any;

  constructor(public catService: CatalogueService, private route: ActivatedRoute, 
    private router: Router) { 
      this.router.events.subscribe((val) =>{
        if(val instanceof NavigationEnd){
          let url = val.url;
          console.log(url);

          // GET THE FIRST PARAM OF THE ROUTE
    let param1 = this.route.params["_value"].p1;
    console.log(param1);

    if(param1 == 1){ // IF param1 = 1, FETCH THE SELECTED PRODUCTS
      this.getProducts('/products/search/selectedProducts');
    
    }else if(param1==2 ){ // IF param1 =2,  FETCH THE PRODUCTS ACCORDING TO THE GIVEN CATEGORY(param2)
      let idCategory = this.route.params["_value"].p2;
      this.getProducts('/categories/'+idCategory+'/products');
    }

        }
      })
  }

  ngOnInit() {
    
  }

  getProducts(url) {
    this.catService.getResource(url)
        .subscribe(data=>{
          this.products = data["_embedded"].products;
        }, err=>{
          console.log(err);
        })
  }

  onEditPhoto(product){
    this.editPhoto = true;
    this.currentProduct = product;
  }

  onSelectedFile(event){
    this.selectedFiles = event.target.files;
  }

  uploadPhoto(){
    this.progress = 0;
    this.currentFileUploaded = this.selectedFiles.item(0);

    this.catService.uploadPhotoProduct(this.currentFileUploaded, this.currentProduct.id)
        .subscribe(event=>{
          if(event.type === HttpEventType.UploadProgress){
            this.progress = Math.round(100 * event.loaded/ event.total);
          } else{
            alert("Photo produit chargee avec succees.");
          }
        }, err=>{
          alert("Probleme de chargement "+JSON.parse(err.error).message);
        });
  }
}
