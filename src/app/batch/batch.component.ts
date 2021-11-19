import { Component, OnInit } from '@angular/core';
import Moralis from 'moralis';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../services/supplyUser/user.service';
import { CoffeeService } from '../services/coffeeSupply/coffee.service';

@Component({
  selector: 'app-batch',
  templateUrl: './batch.component.html',
  styleUrls: ['./batch.component.css']
})
export class BatchComponent implements OnInit {
  url = 'https://chart.googleapis.com/chart?cht=qr&chld=H|1&chs=400x400&chl=' + 'https://rinkeby.etherscan.io/tx/'
  batchNo
  currentAddress
  stageMap
  batchStage
  basicDetail = {
    time: '',
    user: '',
    userContact: '',
    address: '',
    qrCode: '',
    transaction: '',
    regisNo: '',
    farmerAddress: '',
    farmerName: '',
    importerName: '',
    exporterName: ''
  }
  farmInspectorData = {
    time: '',
    user: '',
    userContact: '',
    address: '',
    qrCode: '',
    transaction: '',
    seed: '',
    family: '',
    fert: ''
  }
  harvesterData = {
    time: '',
    user: '',
    userContact: '',
    address: '',
    qrCode: '',
    transaction: '',
    variety: '',
    temperature: '',
    humidity: '',
  }
  exporterData = {
    time: '',
    user: '',
    userContact: '',
    address: '',
    qrCode: '',
    transaction: '',
    quantity: 0,
    destination: '',
    shipName: '',
    shipNo: '',
    dateTime: '',
    exporterID: 0,
    departure: ''
  }
  importerData = {
    time: '',
    user: '',
    userContact: '',
    address: '',
    qrCode: '',
    transaction: '',
    arrivalDateTime: '',
    quantity: 0,
    shipName: '',
    shipNo: '',
    transportInfo: '',
    warehouseName: '',
    warehouseAddress: '',
    importerID: 0 
  }
  processorData = {
    time: '',
    user: '',
    userContact: '',
    address: '',
    qrCode: '',
    transaction: '',
    internalBatchNo: '',
    packageDateTime: '',
    processorAddress: '',
    processorName: '',
    quantity: 0,
    rostingDuration: '',
    temperature: ''
  }

  constructor(private coffeeService: CoffeeService,
              private route: ActivatedRoute,
              private router: Router) { }

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
    this.route.paramMap.subscribe(async params => {
      this.batchNo = params.get('address');
      console.log(this.batchNo);
      this.coffeeService.getBatchStatus(this.batchNo, this.currentAddress)
      .then(function (result) {
        that.batchStage = that.stageMap.get(result)
        let stage = that.stageMap.get(result)
        console.log(stage);
        if (stage >= 0) {
          that.coffeeService.getBasicDetails(that.batchNo, that.currentAddress)
          .then(function(result) {
            that.basicDetail.exporterName = (result as any).exporterName;
            that.basicDetail.importerName = (result as any).importerName;
            that.basicDetail.farmerAddress = (result as any).farmAddress;
            that.basicDetail.farmerName = (result as any).farmerName;
            that.basicDetail.regisNo = (result as any).registrationNo;
          });
          that.coffeeService.getActivityTimestamp("PerformCultivation", that.batchNo, that.currentAddress)
          .then(function(result) {
            console.log(result);
            that.basicDetail.time = (result as any).dataTime;
            that.basicDetail.user = (result as any).name;
            that.basicDetail.userContact = (result as any).contactNo;
            that.basicDetail.address = (result as any).address;
            that.basicDetail.transaction = (result as any).transactionHash;
            that.basicDetail.qrCode = that.url + that.basicDetail.transaction;
          })
          .catch(function(error) {
            console.log(error);
          })
        }
        if (stage >= 1) {
          that.coffeeService.getFarmInspectorData(that.batchNo, that.currentAddress)
          .then(function(result) {
            that.farmInspectorData.family = (result as any).coffeeFamily;
            that.farmInspectorData.seed = (result as any).typeOfSeed;
            that.farmInspectorData.fert = (result as any).fertilizerUsed
          });
          that.coffeeService.getActivityTimestamp("DoneInspection", that.batchNo, that.currentAddress)
          .then(function(result) {
            that.farmInspectorData.time = (result as any).dataTime;
            that.farmInspectorData.user = (result as any).name;
            that.farmInspectorData.userContact = (result as any).contactNo;
            that.farmInspectorData.transaction = (result as any).transactionHash;
            that.farmInspectorData.qrCode = that.url + that.farmInspectorData.transaction;
            that.farmInspectorData.address = (result as any).address;
          })
          .catch(function(error) {
            console.log(error);
          })
        }
        if (stage >= 2) {
          that.coffeeService.getHarvesterData(that.batchNo, that.currentAddress)
          .then(function(result) {
            that.harvesterData.humidity = (result as any).humidity;
            that.harvesterData.variety = (result as any).cropVariety;
            that.harvesterData.temperature = (result as any).temperatureUsed;
          })
          that.coffeeService.getActivityTimestamp("DoneHarvesting", that.batchNo, that.currentAddress)
          .then(function(result) {
            that.harvesterData.time = (result as any).dataTime;
            that.harvesterData.user = (result as any).name;
            that.harvesterData.userContact = (result as any).contactNo;
            that.harvesterData.transaction = (result as any).transactionHash;
            that.harvesterData.qrCode = that.url + that.harvesterData.transaction;
            that.harvesterData.address = (result as any).address;
          })
          .catch(function(error) {
            console.log(error);
          })
        }
        if (stage >= 3) {
          that.coffeeService.getExporterData(that.batchNo, that.currentAddress)
          .then(function(result) {
            that.exporterData.dateTime = new Date(parseInt((result as any).estimateDateTime) * 1000).toUTCString();
            that.exporterData.destination = (result as any).destinationAddress;
            that.exporterData.departure = new Date(parseInt((result as any).departureDateTime) * 1000).toUTCString();
            that.exporterData.exporterID = (result as any).exporterId;
            that.exporterData.quantity = (result as any).quantity;
            that.exporterData.shipName = (result as any).shipName;
            that.exporterData.shipNo = (result as any).shipNo;
          })
          that.coffeeService.getActivityTimestamp("DoneExporting", that.batchNo, that.currentAddress)
          .then(function(result) {
            that.exporterData.time = (result as any).dataTime;
            that.exporterData.user = (result as any).name;
            that.exporterData.userContact = (result as any).contactNo;
            that.exporterData.transaction = (result as any).transactionHash;
            that.exporterData.qrCode = that.url + that.exporterData.transaction;
            that.exporterData.address = (result as any).address;
          })
          .catch(function(error) {
            console.log(error);
          })
        }
        if (stage >= 4) {
          that.coffeeService.getImporterData(that.batchNo, that.currentAddress)
          .then(function (result) {
            that.importerData.arrivalDateTime = new Date(parseInt((result as any).arrivalDateTime) * 1000).toUTCString();
            that.importerData.quantity = (result as any).importerId;
            that.importerData.shipName = (result as any).shipName;
            that.importerData.shipNo = (result as any).shipNo;
            that.importerData.transportInfo = (result as any).transportInfo;
            that.importerData.warehouseAddress = (result as any).warehouseAddress;
            that.importerData.warehouseName = (result as any).warehouseName;
            that.importerData.importerID = (result as any).importerId;
          })
          that.coffeeService.getActivityTimestamp("DoneImporting", that.batchNo, that.currentAddress)
          .then(function(result) {
            that.importerData.time = (result as any).dataTime;
            that.importerData.user = (result as any).name;
            that.importerData.userContact = (result as any).contactNo;
            that.importerData.transaction = (result as any).transactionHash;
            that.importerData.qrCode = that.url + that.importerData.transaction;
            that.importerData.address = (result as any).address;
          })
          .catch(function(error) {
            console.log(error);
          })
        }
        if (stage >= 5) {
          that.coffeeService.getProcessorData(that.batchNo, that.currentAddress)
          .then(function (result) {
            that.processorData.internalBatchNo = (result as any).internalBatchNo;
            that.processorData.packageDateTime = new Date(parseInt((result as any).packageDateTime) * 1000).toUTCString();
            that.processorData.processorAddress = (result as any).processorAddress;
            that.processorData.processorName = (result as any).processorName;
            that.processorData.quantity = (result as any).quantity;
            that.processorData.rostingDuration = (result as any).rostingDuration;
            that.processorData.temperature = (result as any).temperature;
          })
          that.coffeeService.getActivityTimestamp("DoneProcessing", that.batchNo, that.currentAddress)
          .then(function(result) {
            that.processorData.time = (result as any).dataTime;
            that.processorData.user = (result as any).name;
            that.processorData.userContact = (result as any).contactNo;
            that.processorData.transaction = (result as any).transactionHash;
            that.processorData.qrCode = that.url + that.processorData.transaction;
            that.processorData.address = (result as any).address;
          })
          .catch(function(error) {
            console.log(error);
          })
        }
      })
    })
  }

}
