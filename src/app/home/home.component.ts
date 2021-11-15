import { Component, OnInit } from '@angular/core';
import Moralis from 'moralis';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
    const currentUser = Moralis.User.current();
    if (currentUser) {
      let currentAddress = currentUser.get('ethAddress');
      if (currentAddress == environment.adminAddress) {
        this.router.navigate([`/admin`])
      }
      else {
        this.router.navigate([`/user`])
      }
    }
  }

  logIn() {
    Moralis.authenticate()
    .then(async (user) => {
      let currentAddress = user.get('ethAddress');
        if (currentAddress == environment.adminAddress) {
          this.router.navigate([`/admin`])
        }
        else {
          this.router.navigate([`/user`])
        }
    })
  }
}
