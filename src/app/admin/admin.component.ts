import { Component, OnInit } from '@angular/core';
import Moralis from 'moralis';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { UserService } from '../services/supplyUser/user.service';
import { CoffeeService } from '../services/coffeeSupply/coffee.service';
import Swal from 'sweetalert2';

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

  batchForm = {
    regisNo: '',
    farmerName: '',
    farmerAddress: '',
    exporterName: '',
    importerName: '',
  }

  batchInfo = []
  usersInfo = []
  
  currentAddress = ''
  numberOfUsers = 0
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
    this.userService.getPastEvents()
    .then(function(result) {
      console.log(result);
      that.numberOfUsers = (result as any).length;
      for (let item of (result as any)) {
        that.userService.getUserDetail(item.returnValues[0], that.currentAddress)
        .then(function (result) {
          let info = {
            address: item.returnValues[0],
            name: (result as any).name,
            contact: (result as any).contactNo,
            role: (result as any).role
          }
          that.usersInfo.push(info);
        })
      }
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

  createUser() {
    console.log(this.userForm);
    this.userService.createUser(this.userForm.address, this.userForm.name, this.userForm.contact, this.userForm.role, this.currentAddress)
    .then(function (result) {
      console.log(result);
      if (result) {
        Swal.fire(
          'Created an account successfully!',
          `Transaction: ${(result as any).transactionHash}`,
          'success'
        )
      }
    })
  }

  createBatch() {
    this.coffeeService.createBatch(
      this.batchForm.regisNo, 
      this.batchForm.farmerAddress, 
      this.batchForm.farmerAddress, 
      this.batchForm.exporterName, 
      this.batchForm.importerName, 
      this.currentAddress)
    .then(function (result) {
      console.log(result);
      if (result) {
        Swal.fire(
          'Created a batch successfully!',
          `Transaction: ${(result as any).transactionHash}`,
          'success'
        )
      }
    })
  }

}
