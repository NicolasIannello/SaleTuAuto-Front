import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  number:string="+5491127605336";
  @Input() widthC: number | undefined;
  @Input() cap: number | undefined;

  wspW(){
    window.open('https://wa.me/'+this.number);
  }
}
