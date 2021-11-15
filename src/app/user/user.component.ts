import { Component, OnInit } from '@angular/core';
import Moralis from 'moralis';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../services/supplyUser/user.service';
import { CoffeeService } from '../services/coffeeSupply/coffee.service';

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

  batchInfo = []
  currentAddress: ''
  stageMap

  constructor(private router: Router,
              private userService: UserService,
              private coffeeService: CoffeeService) { }

  ngOnInit(): void {
    let that = this;
    this.stageMap = new Map([
      ["FARM_INSPECTION", 0],
      ["HARVESTER", 1],
      ["EXPORTER", 2],
      ["IMPORTER", 3],
      ["PROCESSOR", 4],
      ["DONE", 5]
    ]);
    this.currentAddress = Moralis.User.current().get('ethAddress');
    this.userService.getUserDetail(this.currentAddress, this.currentAddress)
    .then(function (result) {
      that.userInfo.address = that.currentAddress;
      that.userInfo.contact = (result as any).contactNo;
      that.userInfo.name = (result as any).name;
      that.userInfo.role = (result as any).role;
    })
    this.coffeeService.getBatches()
    .then(function (result) {
      console.log(result);
      for (let item of (result as any)) {
        that.coffeeService.getBatchStatus(item.returnValues.batchNo, that.currentAddress)
        .then(function (result) {
          let batch = {
            no: item.returnValues.batchNo,
            stage: that.stageMap.get(result)
          }
          that.batchInfo.push(batch)
        })
      }
    })
  }

  logOut() {
    Moralis.User.logOut().then(() => {
      const currentUser = Moralis.User.current();
      this.router.navigate([``])
    });
  }

}
