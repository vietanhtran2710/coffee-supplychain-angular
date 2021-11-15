import { Component, OnInit } from '@angular/core';
import Moralis from 'moralis';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { UserService } from '../services/supplyUser/user.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  blockChainAddress = {
    adminAddress: environment.adminAddress,
    supplyUserAddress: environment.supplyChainUserAddress,
    storageAddress: environment.supplyChainStorageAddress,
    mainCoffeeAddress: environment.coffeeSupplyChainAddress
  }

  userForm = {
    address: '',
    name: '',
    contact: '',
    role: ''
  }
  
  currentAddress = ''
  numberOfUsers = 0

  constructor(private router: Router,
              private userService: UserService) { }

  ngOnInit(): void {
    let that = this;
    this.currentAddress = Moralis.User.current().get('ethAddress');
    this.userService.getPastEvents()
    .then(function(result) {
      that.numberOfUsers = (result as any).length;
    })
  }

  logOut() {
    Moralis.User.logOut().then(() => {
      const currentUser = Moralis.User.current();
      this.router.navigate([``])
    });
  }

  createUser() {
    console.log(this.userForm);
    this.userService.createUser(this.userForm.address, this.userForm.name, this.userForm.contact, this.userForm.role, this.currentAddress)
    .then(function (result) {
      console.log(result);
    })
  }

}
