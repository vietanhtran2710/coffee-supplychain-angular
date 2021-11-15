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
  batchNo
  currentAddress
  stageMap
  batchStage
  basicDetail = {
    regisNo: '',
    farmerAddress: '',
    farmerName: '',
    importerName: '',
    exporterName: ''
  }
  farmInspectorData = {
    seed: '',
    family: '',
    fert: ''
  }
  harvesterData = {
    variety: '',
    temperature: '',
    humidity: '',
  }
  exporterData = {
    quantity: 0,
    destination: '',
    shipName: '',
    shipNo: '',
    dateTime: '',
    exporterID: 0,
    departure: ''
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
            console.log(result);
            that.basicDetail.exporterName = (result as any).exporterName;
            that.basicDetail.importerName = (result as any).importerName;
            that.basicDetail.farmerAddress = (result as any).farmAddress;
            that.basicDetail.farmerName = (result as any).farmerName;
            that.basicDetail.regisNo = (result as any).registrationNo;
          })
        }
        if (stage >= 1) {
          that.coffeeService.getFarmInspectorData(that.batchNo, that.currentAddress)
          .then(function(result) {
            console.log(result);
            that.farmInspectorData.family = (result as any).coffeeFamily;
            that.farmInspectorData.seed = (result as any).typeOfSeed;
            that.farmInspectorData.fert = (result as any).fertilizerUsed
          })
        }
        if (stage >= 2) {
          that.coffeeService.getHarvesterData(that.batchNo, that.currentAddress)
          .then(function(result) {
            console.log(result);
            that.harvesterData.humidity = (result as any).humidity;
            that.harvesterData.variety = (result as any).cropVariety;
            that.harvesterData.temperature = (result as any).temperatureUsed;
          })
        }
        if (stage >= 3) {
          that.coffeeService.getExporterData(that.batchNo, that.currentAddress)
          .then(function(result) {
            console.log(result);
            that.exporterData.dateTime = new Date(parseInt((result as any).estimateDateTime) * 1000).toUTCString();
            that.exporterData.destination = (result as any).destinationAddress;
            that.exporterData.departure = new Date(parseInt((result as any).departureDateTime) * 1000).toUTCString();
            that.exporterData.exporterID = (result as any).exporterId;
            that.exporterData.quantity = (result as any).quantity;
            that.exporterData.shipName = (result as any).shipName;
            that.exporterData.shipNo = (result as any).shipNo;
          })
        }
        if (stage >= 4) {

        }
        if (stage >= 5) {

        }
      })
    })
  }

}
