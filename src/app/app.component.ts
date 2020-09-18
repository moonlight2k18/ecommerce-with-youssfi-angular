import { Component, OnInit } from '@angular/core';
import { CatalogueService } from './services/catalogue.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  public categories: any;
  public currentCategory;

  constructor(private catalogueService: CatalogueService, private router: Router){

  }

  ngOnInit(): void {
    this.getCategories();
  }

  private getCategories(){
    this.catalogueService.getResource('/categories')
        .subscribe(data=>{
          this.categories = data["_embedded"].categories;

        }, err=>{
          console.log(err);
        })
  }

  getProductsByCategory(c){
    this.currentCategory = c;
    this.router.navigateByUrl('products/2/'+c.id);
  }

  onSelectedProducts(){
    this.currentCategory = undefined;
    this.router.navigateByUrl("/");
  }
}
