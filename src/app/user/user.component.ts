import { Component, OnInit } from '@angular/core';
import Moralis from 'moralis';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../services/supplyUser/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  userInfo = {
    address: '',
    name: '',
    contact: '',
    role: ''
  }

  constructor(private router: Router,
              private userService: UserService) { }

  ngOnInit(): void {
    let that = this;
    let currentAddress = Moralis.User.current().get('ethAddress');
    this.userService.getUserDetail(currentAddress, currentAddress)
    .then(function (result) {
      that.userInfo.address = currentAddress;
      that.userInfo.contact = (result as any).contactNo;
      that.userInfo.name = (result as any).name;
      that.userInfo.role = (result as any).role;
    })
  }

  logOut() {
    Moralis.User.logOut().then(() => {
      const currentUser = Moralis.User.current();
      this.router.navigate([``])
    });
  }

}
