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
  currentBatch: ''

  farmForm = {
    seedType: '',
    family: '',
    fert: '',
  }

  harvesterForm = {
    variety: '',
    temperature: '',
    humidity: '',
  }

  exporterForm = {
    quantity: 0,
    destination: '',
    shipName: '',
    shipNo: '',
    dateTime: 0,
    exporterID: 0,
  }

  importerForm = {
    quantity: 0,
    transportInfo: '',
    warehouseName: '',
    warehouseAddress: '',
    importerID: 0 
  }

  processingForm = {
    quantity: 0,
    temperature: '',
    roastingTime: 0,
    internalNo: '',
    dateTime: 0,
    processorName: '',
    processAddress: ''
  }

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
          console.log(result);
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

  editingCurrentBatch(batchNo) {
    this.currentBatch = batchNo;
  }

  clearFarmForm() {
    this.farmForm.family = '';
    this.farmForm.fert = '';
    this.farmForm.seedType = '';
  }

  clearHarvesterForm() {
    this.harvesterForm.humidity = '';
    this.harvesterForm.temperature = '';
    this.harvesterForm.variety = '';
  }

  clearExporterForm() {
    this.exporterForm.dateTime = 0;
    this.exporterForm.destination = '';
    this.exporterForm.exporterID = 0;
    this.exporterForm.quantity = 0;
    this.exporterForm.shipName = '';
    this.exporterForm.shipNo = '';
  }

  clearImporterForm() {
    this.importerForm.importerID = 0;
    this.importerForm.quantity = 0;
    this.importerForm.transportInfo = '';
    this.importerForm.warehouseAddress = '';
    this.importerForm.warehouseName = '';
  }

  clearProcessingForm() {
    this.processingForm.dateTime = 0;
    this.processingForm.internalNo = '';
    this.processingForm.processAddress = '';
    this.processingForm.processorName = '';
    this.processingForm.quantity = 0;
    this.processingForm.roastingTime = 0;
    this.processingForm.temperature = '';
  }

  updateFarmInspectorDetails() {
    this.coffeeService.updateFarmInspectorData(this.currentBatch, this.farmForm.family, this.farmForm.seedType, this.farmForm.fert, this.currentAddress)
    .then(function (result) {
      console.log(result);
    })
  }

}
