import { Component } from '@angular/core';
import { Moralis} from 'moralis'
import { environment } from '../environments/environment'

Moralis.initialize(environment.applicationID);
Moralis.serverURL = environment.serverURL;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'client';
}
