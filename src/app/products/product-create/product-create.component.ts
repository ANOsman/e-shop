import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Product } from '../product';
import { ProductsService } from '../products.service';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { priceRangeValidator } from '../price-range.directive';
import { Observable, map } from 'rxjs';


@Component({
  selector: 'app-product-create',
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.css']
})
export class ProductCreateComponent implements OnInit {

  @Output() added = new EventEmitter<Product>();
  productForm = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: Validators.required
    }),
    price: new FormControl<number | undefined>(undefined, {
      nonNullable: true,
      validators: [Validators.required, priceRangeValidator(), Validators.pattern(/ab+c/)]
    })
  });
  showPriceRangeHint = false;
  get name() { return this.productForm.controls.name }
  get price() { return this.productForm.controls.price }

  constructor(private productsService: ProductsService) {}

  ngOnInit(): void {
    this.price.valueChanges.subscribe(price => {
      if (price) {
        this.showPriceRangeHint = price < 1 && price > 10000;
      }
    });
  }

  createProduct() {
    this.productsService.addProduct(this.name.value, Number(this.price.value)).subscribe(product => {
      this.productForm.reset();
      this.added.emit(product);
    });
  }
}
