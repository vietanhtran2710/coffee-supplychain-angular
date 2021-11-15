import { Component } from '@angular/core';
import { Moralis} from 'moralis'

Moralis.initialize("ZEX3yVifN3xhN77nhVJ5l4AdNjJReWowUWj2A0z7");
Moralis.serverURL = "https://ph8j4ljzuz8s.usemoralis.com:2053/server";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'client';
}
